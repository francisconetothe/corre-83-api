import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger('PrismaService');

  constructor() {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
    super({ adapter });
  }

  async onModuleInit() {
    // Conexão NÃO-bloqueante: o app sobe e chama listen() sem esperar o banco.
    // Isso evita o erro "did not call listen() within 3 seconds".
    this.$connect()
      .then(() => this.logger.log('✅ Conectado ao banco'))
      .catch((err) =>
        this.logger.error(
          '⚠️ Falha ao conectar no boot (Prisma tentará na 1ª query): ' +
            err.message,
        ),
      );
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
