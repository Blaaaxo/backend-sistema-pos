import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    // Habilitar el registro de consultas SQL
    constructor() {
        super({
            log: ['query', 'info', 'warn', 'error'],
        });
    }

    // Metodo que se ejecuta al iniciar el módulo
    async onModuleInit() {
        await this.$connect();
    }

    // Metodo que se ejecuta al destruir el módulo
    async onModuleDestroy() {
        await this.$disconnect();
    }
}