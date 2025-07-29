import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OrdenComprasService } from './orden-compras.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateOrdenCompraDTO } from './dto/create-orden-compra.dto';
import { User } from '../../common/decorators/user.decorator';

@Controller('orden-compras')
export class OrdenComprasController {
  constructor(private readonly service: OrdenComprasService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() dto: CreateOrdenCompraDTO,
    @User() user: { userId: number; email: string },
  ) {
    return this.service.create(dto, user.userId);
  }
}
