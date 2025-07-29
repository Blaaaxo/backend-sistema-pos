import { Module } from "@nestjs/common";
import { ProveedoresController } from "./proveedores.controller";
import { ProveedoresService } from "./proveedores.service";

@Module({
    controllers: [ProveedoresController],
    providers: [ProveedoresService],
    exports: [], // Exporta el servicio si es necesario en otros módulos
})
export class ProveedoresModule {}