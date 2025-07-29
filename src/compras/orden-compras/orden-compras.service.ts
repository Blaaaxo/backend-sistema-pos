import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrdenCompraDTO } from './dto/create-orden-compra.dto';

@Injectable()
export class OrdenComprasService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrdenCompraDTO, userId: number) {
    const proveedor = await this.prisma.proveedor.findUnique({
      where: { id: dto.proveedor_id },
    });

    if (!proveedor) {
      throw new Error(`Proveedor con ID ${dto.proveedor_id} no existe.`);
    }

    for (const item of dto.detalles) {
      const exists = await this.prisma.producto.findUnique({
        where: { id: item.producto_id },
        select: { id: true },
      });

      if (!exists) {
        throw new Error(`Producto con ID ${item.producto_id} no existe.`);
      }
    }

    const detallesCalculados = dto.detalles.map((item) => {
      const subtotal = item.cantidad * item.precio_unitario;

      const iva = item.iva_porcentaje
        ? (subtotal * item.iva_porcentaje) / 100
        : 0;
      const consumo = item.consumo_porcentaje
        ? (subtotal * item.consumo_porcentaje) / 100
        : 0;
      const saludable = item.saludable_porcentaje
        ? (subtotal * item.saludable_porcentaje) / 100
        : 0;

      return {
        ...item,
        subtotal,
        total: subtotal + iva + consumo + saludable,
      };
    });

    const total_sin_imp = detallesCalculados.reduce(
      (acc, item) => acc + item.subtotal,
      0,
    );
    const total_con_imp = detallesCalculados.reduce(
      (acc, item) => acc + item.total,
      0,
    );

    return this.prisma.ordenCompra.create({
      data: {
        proveedor: { connect: { id: dto.proveedor_id } },
        user: { connect: { id: userId } },
        observaciones: dto.observaciones,
        estado: 'pendiente',
        total_sin_imp,
        total_con_imp,
        detalles: {
          create: detallesCalculados.map((item) => ({
            producto: { connect: { id: item.producto_id } },
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario,
            iva_porcentaje: item.iva_porcentaje,
            consumo_porcentaje: item.consumo_porcentaje,
            saludable_porcentaje: item.saludable_porcentaje,
          })),
        },
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
    });
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
