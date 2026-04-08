import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArtigosService {
  constructor(private prisma: PrismaService) {}

  async criar(data: any) {
    return this.prisma.article.create({
      data: {
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl, // <-- ADICIONADO PARA SALVAR A FOTO
        // Como seu schema exige um Columnist, vamos criar um fixo ou usar o ID
        // Para simplificar, garantimos que existe um colunista padrão
        columnist: {
          connectOrCreate: {
            where: { id: 'default-columnist' },
            create: { id: 'default-columnist', name: data.columnistName || 'Colunista Correria' }
          }
        }
      },
    });
  }

  async listar() {
    return this.prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      include: { columnist: true } // Para pegar o nome do autor
    });
  }

  async deletar(id: string) {
    return this.prisma.article.delete({ where: { id } });
  }
}