import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.plan.create({
      data: {
        name: data.name,
        price: data.price,
        description: data.description,
        benefits: data.benefits, // Vamos salvar como string separada por "|"
        isFeatured: data.isFeatured || false,
      }
    });
  }

  async findAll() {
    return this.prisma.plan.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async remove(id: number) {
    return this.prisma.plan.delete({ where: { id } });
  }
}