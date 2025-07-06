import { Module } from '@nestjs/common';
import { OrdenComprasController } from './orden-compras.controller';
import { OrdenComprasService } from './orden-compras.service';

@Module({
  controllers: [OrdenComprasController],
  providers: [OrdenComprasService],
  exports: [],
})
export class OrdenComprasModule {}
