import {
    Body,
    Controller,
    Post,
    UseGuards,
} from '@nestjs/common';
import { CreateIngresoCompraDTO } from './dto/create-ingreso-compra.dto';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { IngresoCompraService } from './ingreso-compras.service';

@Controller('ingresos-compra')
export class IngresoCompraController {
    constructor(private readonly service: IngresoCompraService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @Body() dto: CreateIngresoCompraDTO,
        @User() user: { userId: number },
    ) {
        return this.service.create(dto, user.userId);
    }
}
