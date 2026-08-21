// src/provas/provas.controller.ts
import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { ProvasService } from './provas.service';

@Controller('provas')
export class ProvasController {
  constructor(private readonly provasService: ProvasService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // Usa UPLOAD_DIR (pasta persistente em produção) ou ./uploads local
          const uploadPath = join(
            process.env.UPLOAD_DIR || join(process.cwd(), 'uploads'),
            'provas',
          );
          if (!existsSync(uploadPath))
            mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `prova-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  criar(@UploadedFile() file: Express.Multer.File, @Body() data: any) {
    // 🌍 URL pública dos uploads (public_html do domínio principal em produção)
    const publicUrl = process.env.PUBLIC_UPLOAD_URL || 'http://localhost:3001';

    const imageUrl = file
      ? `${publicUrl}/uploads/provas/${file.filename}`
      : null;

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
