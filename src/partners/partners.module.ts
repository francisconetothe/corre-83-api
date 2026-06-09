import { Module } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { PartnersController } from './partners.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PartnersController],
  providers: [PartnersService, PrismaService], // 👈 PrismaService precisa estar aqui
})
export class PartnersModule {}
