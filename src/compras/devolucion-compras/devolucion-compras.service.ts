import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDevolucionComprasDTO } from './dto/create-devolucion-compras.dto';

@Injectable()
export class DevolucionComprasService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateDevolucionComprasDTO, userId: number) {
        // Validar bodega
        const bodega = await this.prisma.bodega.findUnique({
            where: { id: dto.bodega_id },
        });
        if (!bodega) throw new NotFoundException('Bodega no existe');

        // Validar productos
        for (const item of dto.detalles) {
            const producto = await this.prisma.producto.findUnique({
                where: { id: item.producto_id },
            });
            if (!producto) throw new NotFoundException(`Producto ID ${item.producto_id} no existe`);
        }

        // Crear devolución y sus detalles
        const devolucion = await this.prisma.devolucionesProveedor.create({
            data: {
                bodega: { connect: { id: dto.bodega_id } },
                user: { connect: { id: userId } },
                motivo_salida: dto.motivo_salida,
                observaciones: dto.observaciones,
                total_con_imp: dto.total_con_imp,
                total_sin_imp: dto.total_sin_imp,
                fecha: new Date(), // Agregar el campo obligatorio 'fecha'
                detalles: {
                    create: dto.detalles.map((detalle) => ({
                        producto: { connect: { id: detalle.producto_id } },
                        cantidad: detalle.cantidad,
                        costo_unitario: detalle.costo_unitario,
                        iva_porcentaje: detalle.iva_porcentaje,
                        iva_valor: detalle.iva_valor,
                        consumo_porcentaje: detalle.consumo_porcentaje,
                        consumo_valor: detalle.consumo_valor,
                        saludable_porcentaje: detalle.saludable_porcentaje,
                        saludable_valor: detalle.saludable_valor,
                    })),
                },
            },
            include: {
                detalles: true,
                bodega: true,
                user: true,
            },
        });

        // 🔁 ACTUALIZAR STOCK Y REGISTRAR KARDEX
        for (const detalle of devolucion.detalles) {
            const productoId = detalle.producto_id;
            const cantidad = Number(detalle.cantidad);
            const costoUnitario = detalle.costo_unitario;

            const existencia = await this.prisma.existenciaProductoBodega.findUnique({
                where: {
                    producto_id_bodega_id: {
                        producto_id: productoId,
                        bodega_id: dto.bodega_id,
                    },
                },
            });

            if (!existencia || existencia.stock < cantidad) {
                throw new BadRequestException(
                    `Stock insuficiente para producto ${productoId} en bodega ${dto.bodega_id}`
                );
            }

            const nuevoStock = existencia.stock - cantidad;

            await this.prisma.existenciaProductoBodega.update({
                where: {
                    producto_id_bodega_id: {
                        producto_id: productoId,
                        bodega_id: dto.bodega_id,
                    },
                },
                data: { stock: nuevoStock },
            });

            await this.prisma.kardex.create({
                data: {
                    producto: { connect: { id: productoId } },
                    bodega: { connect: { id: dto.bodega_id } },
                    fecha: new Date(),
                    tipo_movimiento: 'salida',
                    documento_origen: 'devolucion_proveedor',
                    documento_id: devolucion.id,
                    cantidad,
                    costo_unitario: costoUnitario,
                    stock_resultante: nuevoStock,
                    user: { connect: { id: userId } },
                    observaciones: `Devolución a proveedor #${devolucion.id}`,
                },
            });
        }

        return devolucion;
    }
}
