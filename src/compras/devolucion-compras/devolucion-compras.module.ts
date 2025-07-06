import { Module } from "@nestjs/common";
import { DevolucionComprasController } from "./devolucion-compras.controller";
import { DevolucionComprasService } from "./devolucion-compras.service";


@Module({
    controllers: [DevolucionComprasController],
    providers: [DevolucionComprasService],
    exports: [], 
})
export class DevolucionComprasModule {}