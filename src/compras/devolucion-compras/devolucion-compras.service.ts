import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDevolucionComprasDTO } from './dto/create-devolucion-compras.dto';

@Injectable()
export class DevolucionComprasService {
  constructor(private prisma: PrismaService) {}

  async create(
    dto: CreateDevolucionComprasDTO,
    user_id: number,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const devolucion = await tx.devolucionesProveedor.create({
        data: {
          fecha: new Date(),
          bodega_id: dto.bodega_id,
          motivo_salida: dto.motivo_salida,
          observaciones: dto.observaciones ?? null,
          total_con_imp: dto.total_con_imp,
          total_sin_imp: dto.total_sin_imp,
          user_id: user_id,
        },
      });

      for (const detalle of dto.detalles) {
        const {
          producto_id,
          cantidad,
          costo_unitario,
          iva_porcentaje,
          iva_valor,
          consumo_porcentaje,
          consumo_valor,
          saludable_porcentaje,
          saludable_valor,
        } = detalle;

        // Obtener existencia actual
        const existencia = await tx.existenciaProducto.findUniqueOrThrow({
          where: {
            producto_id_bodega_id: {
              producto_id,
              bodega_id: dto.bodega_id,
            },
          },
        });

        const nuevoStock = existencia.stock_bueno - cantidad;
        if (nuevoStock < 0) {
          throw new BadRequestException(
            `No hay suficiente stock bueno para el producto ID ${producto_id}`,
          );
        }

        // Actualizar stock
        await tx.existenciaProducto.update({
          where: {
            producto_id_bodega_id: {
              producto_id,
              bodega_id: dto.bodega_id,
            },
          },
          data: {
            stock_bueno: nuevoStock,
          },
        });

        // Crear detalle de la devolución
        await tx.devolucionesProveedorDetalle.create({
          data: {
            devolucion_id: devolucion.id,
            producto_id,
            cantidad,
            costo_unitario,
            iva_porcentaje,
            iva_valor,
            consumo_porcentaje,
            consumo_valor,
            saludable_porcentaje,
            saludable_valor,
          },
        });

        // Registrar en Kardex
        await tx.kardex.create({
          data: {
            producto_id,
            bodega_id: dto.bodega_id,
            fecha: new Date(),
            tipo_movimiento: 'DEVOLUCION_COMPRA',
            documento_origen: 'devolucion_compra',
            documento_id: devolucion.id,
            cantidad,
            costo_unitario,
            stock_resultante: nuevoStock,
            user_id: user_id,
            observaciones: dto.observaciones ?? null,
          },
        });
      }

      return devolucion;
    });
  }
}
