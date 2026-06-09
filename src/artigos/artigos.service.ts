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
        imageUrl: data.imageUrl,
        // Agora usamos o connect direto, ligando o artigo ao colunista real escolhido no painel
        columnist: {
          connect: { id: data.columnistId },
        },
      },
    });
  }

  async listar() {
    return this.prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      include: { columnist: true }, // Para pegar o nome do autor
    });
  }

  async deletar(id: string) {
    return this.prisma.article.delete({ where: { id } });
  }
}
