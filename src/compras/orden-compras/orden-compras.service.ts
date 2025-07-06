import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateOrdenCompraDTO } from "./dto/create-orden-compra.dto";

@Injectable()
export class OrdenComprasService {
    constructor(private prisma: PrismaService) { }


    async create(dto: CreateOrdenCompraDTO, userId: number) {
        // validar que el proveedor exista
        const proveedor = await this.prisma.proveedor.findUnique({
            where: { id: dto.proveedor_id },
        });

        if (!proveedor) {
            throw new Error(`Proveedor con ID ${dto.proveedor_id} no existe.`);
        }

        // validar que todos los productos existan
        for (const item of dto.detalles) {
            const exists = await this.prisma.producto.findUnique({
                where: { id: item.producto_id },
                select: { id: true },
            });

            if (!exists) {
                throw new Error(`Producto con ID ${item.producto_id} no existe.`);
            }
        }

        // crear la orden con detalles
        return this.prisma.ordenCompra.create({
            data: {
                proveedor: { connect: { id: dto.proveedor_id } },
                user: { connect: { id: userId } },
                observaciones: dto.observaciones,
                estado: "pendiente",
                detalles: {
                    create: dto.detalles.map((detalle) => ({
                        producto: { connect: { id: detalle.producto_id } },
                        cantidad: detalle.cantidad,
                        precio_unitario: detalle.precio_unitario,
                        iva_porcentaje: detalle.iva_porcentaje,
                        consumo_porcentaje: detalle.consumo_porcentaje,
                        saludable_porcentaje: detalle.saludable_porcentaje,    
                    })),
                }
            },
            include: {
                proveedor: true,
                user: true,
                detalles: {
                    include: {
                        producto: true,
                    },
                },
            },
        })
    }

    async findAll() {
        return this.prisma.ordenCompra.findMany({
            include: {
                proveedor: true,
                user: true,
                detalles: {
                    include: {
                        producto: true,
                    },
                },
            },
        });
    }

    async findOne(id: number) {
        const ordenCompra = await this.prisma.ordenCompra.findUnique({
            where: { id },
            include: {
                proveedor: true,
                user: true,
                detalles: {
                    include: {
                        producto: true,
                    },
                },
            },
        });

        if (!ordenCompra) {
            throw new Error(`Orden de compra con ID ${id} no encontrada.`);
        }

        return ordenCompra;
    }
}