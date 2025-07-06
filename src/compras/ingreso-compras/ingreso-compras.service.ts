import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateIngresoCompraDTO } from './dto/create-ingreso-compra.dto';

@Injectable()
export class IngresoCompraService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateIngresoCompraDTO, userId: number) {
        // Validar proveedor
        const proveedor = await this.prisma.proveedor.findUnique({
            where: { id: dto.proveedor_id },
        });
        if (!proveedor) throw new NotFoundException('Proveedor no existe');

        // Validar bodega
        const bodega = await this.prisma.bodega.findUnique({
            where: { id: dto.bodega_id },
        });
        if (!bodega) throw new NotFoundException('Bodega no existe');

        // Validar productos
        for (const detalle of dto.detalles) {
            const producto = await this.prisma.producto.findUnique({
                where: { id: detalle.producto_id },
            });
            if (!producto) {
                throw new NotFoundException(`Producto ID ${detalle.producto_id} no existe`);
            }
        }

        // Crear ingreso y sus detalles
        const ingreso = await this.prisma.ingresoCompra.create({
            data: {
                proveedor: { connect: { id: dto.proveedor_id } },
                bodega: { connect: { id: dto.bodega_id } },
                user: { connect: { id: userId } },
                observaciones: dto.observaciones,
                ordenCompra: dto.orden_compra_id
                    ? { connect: { id: dto.orden_compra_id } }
                    : undefined,
                total_con_imp: dto.total_con_imp,
                total_sin_imp: dto.total_sin_imp,
                detalles: {
                    create: dto.detalles.map((detalle) => ({
                        producto: { connect: { id: detalle.producto_id } },
                        cantidad: detalle.cantidad,
                        precio_unitario: detalle.precio_unitario,
                        iva_porcentaje: detalle.iva_porcentaje,
                        iva_valor: detalle.iva_valor,
                        consumo_porcentaje: detalle.consumo_porcentaje,
                        consumo_valor: detalle.consumo_valor,
                        saludable_porcentaje: detalle.saludable_porcentaje,
                        saludable_valor: detalle.saludable_valor,
                        otros_costos: detalle.otros_costos,
                        costo_total: detalle.costo_total,
                    })),
                },
            },
            include: {
                detalles: true,
                proveedor: true,
                bodega: true,
                user: true,
            },
        });

        // ACTUALIZAR STOCK Y REGISTRAR KARDEX
        for (const detalle of ingreso.detalles) {
            const productoId = detalle.producto_id;
            const cantidad = Number(detalle.cantidad);
            const costoUnitario = detalle.precio_unitario;

            // Buscar existencia actual
            const existencia = await this.prisma.existenciaProductoBodega.findUnique({
                where: {
                    producto_id_bodega_id: {
                        producto_id: productoId,
                        bodega_id: ingreso.bodega_id,
                    },
                },
            });

            let nuevoStock = cantidad;

            if (existencia) {
                // Actualizar stock existente
                nuevoStock = existencia.stock + cantidad;
                await this.prisma.existenciaProductoBodega.update({
                    where: {
                        producto_id_bodega_id: {
                            producto_id: productoId,
                            bodega_id: ingreso.bodega_id,
                        },
                    },
                    data: { stock: nuevoStock },
                });
            } else {
                // Crear nueva existencia
                await this.prisma.existenciaProductoBodega.create({
                    data: {
                        producto: { connect: { id: productoId } },
                        bodega: { connect: { id: ingreso.bodega_id } },
                        stock: cantidad,
                    },
                });
            }

            // Registrar movimiento en kardex
            await this.prisma.kardex.create({
                data: {
                    producto: { connect: { id: productoId } },
                    bodega: { connect: { id: ingreso.bodega_id } },
                    fecha: new Date(),
                    tipo_movimiento: 'entrada',
                    documento_origen: 'ingreso_compra',
                    documento_id: ingreso.id,
                    cantidad,
                    costo_unitario: costoUnitario,
                    stock_resultante: nuevoStock,
                    user: { connect: { id: userId } },
                    observaciones: `Ingreso de compra #${ingreso.id}`,
                },
            });
        }
        return ingreso;
    }
}
