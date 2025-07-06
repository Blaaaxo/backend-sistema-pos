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

        // TODO: Aquí puedes actualizar stock, kardex, etc.
        return ingreso;
    }
}
