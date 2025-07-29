import { Controller, Get, UseGuards } from "@nestjs/common";
import { ProveedoresService } from "./proveedores.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";


@Controller('proveedores')
export class ProveedoresController {
    constructor(private readonly proveedoresService: ProveedoresService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll() {
        return this.proveedoresService.findAll();
    }
}
