import {
    Body,
    Controller,
    Post,
    UseGuards,
  } from '@nestjs/common';

  import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
  import { User } from '../../common/decorators/user.decorator';
import { DevolucionComprasService } from './devolucion-compras.service';
import { CreateDevolucionComprasDTO } from './dto/create-devolucion-compras.dto';
  
  @Controller('devoluciones-compras')
  export class DevolucionComprasController {
    constructor(private readonly service: DevolucionComprasService) {}
  
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
      @Body() dto: CreateDevolucionComprasDTO,
      @User() user: { userId: number },
    ) {
      return this.service.create(dto, user.userId);
    }
  }
  