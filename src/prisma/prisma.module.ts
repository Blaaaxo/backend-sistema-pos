import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {
  // Este modulo se declara como global para que pueda ser importado en otros módulos sin necesidad de volver a declararlo.
  // Aquí podrías agregar proveedores de Prisma si los necesitas, como un cliente de Prisma.
}