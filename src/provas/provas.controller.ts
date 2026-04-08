// src/provas/provas.controller.ts
import { Controller, Post, Get, Delete, Body, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { ProvasService } from './provas.service';

@Controller('provas')
export class ProvasController {
  constructor(private readonly provasService: ProvasService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        // process.cwd() garante que a pasta seja criada na raiz do projeto em qualquer ambiente
        const uploadPath = join(process.cwd(), 'uploads', 'provas');
        if (!existsSync(uploadPath)) mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `prova-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  criar(@UploadedFile() file: Express.Multer.File, @Body() data: any) {
    // 🌍 Pega a URL base do .env (local ou produção)
    const baseUrl = process.env.BASE_URL || 'http://localhost:3001';

    // Monta a URL da imagem dinamicamente usando a baseUrl
    const imageUrl = file 
      ? `${baseUrl}/uploads/provas/${file.filename}` 
      : null;

    // Passamos os dados do body + a URL da imagem para o service
    return this.provasService.criar({ ...data, imageUrl });
  }

  @Get()
  listar() {
    return this.provasService.listarTodas();
  }

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.provasService.deletar(id);
  }
}