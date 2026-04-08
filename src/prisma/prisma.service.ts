// path: src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect(); // Conecta no banco assim que o Nest sobe
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Fecha a conexão quando o Nest desliga
  }
}