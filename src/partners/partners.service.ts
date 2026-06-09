import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PartnersService {
  constructor(private prisma: PrismaService) {}

  // Busca todos os parceiros
  async findAll() {
    return this.prisma.partner.findMany({
      orderBy: { name: 'asc' }, // Opcional: já traz em ordem alfabética
    });
  }

  // Salva um novo parceiro
  async create(data: { name: string; logoUrl: string; website?: string }) {
    return this.prisma.partner.create({
      data: {
        name: data.name,
        logoUrl: data.logoUrl,
        website: data.website || null,
        isSponsor: false, // Mantendo o padrão do seu schema
      },
    });
  }

  // Deleta um parceiro
  async remove(id: string) {
    // Verifica se existe antes de deletar
    const partner = await this.prisma.partner.findUnique({ where: { id } });
    if (!partner) {
      throw new NotFoundException('Parceiro não encontrado.');
    }

    return this.prisma.partner.delete({
      where: { id },
    });
  }
}
