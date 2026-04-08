// src/provas/provas.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProvasService {
  constructor(private prisma: PrismaService) {}

  async criar(data: any) {
    return this.prisma.raceCalendar.create({
      data: {
        ...data,
        date: new Date(data.date), // Garante que a string do front vire Date
      },
    });
  }

  async listarTodas() {
    return this.prisma.raceCalendar.findMany({
      orderBy: { date: 'asc' },
    });
  }

  async deletar(id: string) {
    return this.prisma.raceCalendar.delete({ where: { id } });
  }
}