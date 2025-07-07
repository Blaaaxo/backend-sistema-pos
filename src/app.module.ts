import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { OrdenComprasModule } from './compras/orden-compras/orden-compras.module';
import { IngresoComprasModule } from './compras/ingreso-compras/ingreso-compras.module';
import { DevolucionComprasModule } from './compras/devolucion-compras/devolucion-compras.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, OrdenComprasModule, IngresoComprasModule, DevolucionComprasModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
