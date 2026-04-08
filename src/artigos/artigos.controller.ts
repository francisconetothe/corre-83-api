import { Controller, Post, Get, Delete, Body, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { ArtigosService } from './artigos.service';

@Controller('artigos')
export class ArtigosController {
  constructor(private readonly artigosService: ArtigosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        // process.cwd() garante que a pasta será criada na raiz do projeto tanto local quanto no Render
        const uploadPath = join(process.cwd(), 'uploads', 'artigos');
        if (!existsSync(uploadPath)) mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `artigo-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  criar(@UploadedFile() file: Express.Multer.File, @Body() data: any) {
    // 🌍 BUSCA A URL DA VARIÁVEL DE AMBIENTE OU USA O PADRÃO LOCAL
    const baseUrl = process.env.BASE_URL || 'http://localhost:3001';

    // Gera a URL completa dinamicamente
    const imageUrl = file 
      ? `${baseUrl}/uploads/artigos/${file.filename}` 
      : null;

    // Repassa os dados para o Service
    return this.artigosService.criar({ ...data, imageUrl });
  }

  @Get()
  listar() {
    return this.artigosService.listar();
  }

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.artigosService.deletar(id);
  }
}