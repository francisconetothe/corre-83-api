import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ColumnistsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.columnist.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(data: { name: string; bio?: string; photoUrl?: string }) {
    return this.prisma.columnist.create({
      data: {
        name: data.name,
        bio: data.bio || null,
        photoUrl: data.photoUrl || null,
      },
    });
  }

  async remove(id: string) {
    const columnist = await this.prisma.columnist.findUnique({ where: { id } });
    if (!columnist) throw new NotFoundException('Colunista não encontrado.');

    return this.prisma.columnist.delete({
      where: { id },
    });
  }

  async findOne(id: string) {
    return this.prisma.columnist.findUnique({
      where: { id },
      include: {
        articles: { orderBy: { createdAt: 'desc' } }, // 👈 Traz os artigos na ordem do mais novo pro mais velho
      },
    });
  }
}
