import { Module } from "@nestjs/common";
import { IngresoCompraController } from "./ingreso-compras.controller";
import { IngresoCompraService } from "./ingreso-compras.service";


@Module({
    controllers: [IngresoCompraController],
    providers: [IngresoCompraService],
    exports: [],
})
export class IngresoComprasModule {}