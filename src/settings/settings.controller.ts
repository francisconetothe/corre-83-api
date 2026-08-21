import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { PrismaService } from '../prisma/prisma.service';

@Controller('settings')
export class SettingsController {
  constructor(private prisma: PrismaService) {}

  // Diretório base de uploads (persistente em produção via UPLOAD_DIR)
  private getUploadDir() {
    return process.env.UPLOAD_DIR || join(process.cwd(), 'uploads');
  }

  // URL pública base dos arquivos
  private getPublicUploadUrl() {
    return process.env.PUBLIC_UPLOAD_URL || 'http://localhost:3001';
  }

  // --- ROTA DO BANNER ---
  @Post('banner')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(
            process.env.UPLOAD_DIR || join(process.cwd(), 'uploads'),
            'banners',
          );
          if (!existsSync(uploadPath))
            mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `banner-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadBanner(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Arquivo não recebido');

    const url = `${this.getPublicUploadUrl()}/uploads/banners/${file.filename}`;

    await this.prisma.aboutUs.upsert({
      where: { id: 'main-config' },
      update: { imageUrl: url },
      create: {
        id: 'main-config',
        content: 'Configurações Gerais',
        imageUrl: url,
      },
    });

    return { url };
  }

  // --- ROTA DA LOGO ---
  @Post('logo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(
            process.env.UPLOAD_DIR || join(process.cwd(), 'uploads'),
            'logos',
          );
          if (!existsSync(uploadPath))
            mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `logo-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadLogo(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Arquivo da logo não recebido');

    const url = `${this.getPublicUploadUrl()}/uploads/logos/${file.filename}`;

    await this.prisma.aboutUs.upsert({
      where: { id: 'main-config' },
      update: { logoUrl: url },
      create: {
        id: 'main-config',
        content: 'Configurações Gerais',
        logoUrl: url,
      },
    });

    return { url };
  }

  // --- ROTA FOTO QUEM SOMOS ---
  @Post('about-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(
            process.env.UPLOAD_DIR || join(process.cwd(), 'uploads'),
            'about',
          );
          if (!existsSync(uploadPath))
            mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `about-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadAboutImage(@UploadedFile() file: Express.Multer.File) {
    if (!file)
      throw new BadRequestException('Imagem de Quem Somos não recebida');

    const url = `${this.getPublicUploadUrl()}/uploads/about/${file.filename}`;

    await this.prisma.aboutUs.upsert({
      where: { id: 'main-config' },
      update: { aboutImageUrl: url },
      create: {
        id: 'main-config',
        content: 'Configurações Gerais',
        aboutImageUrl: url,
      },
    });

    return { url };
  }

  // --- ROTA TEXTO QUEM SOMOS ---
  @Post('about-text')
  async updateAboutText(@Body() body: { content: string }) {
    if (!body.content)
      throw new BadRequestException('O conteúdo não pode estar vazio');

    return this.prisma.aboutUs.upsert({
      where: { id: 'main-config' },
      update: { content: body.content },
      create: { id: 'main-config', content: body.content },
    });
  }

  // --- RETORNA TODAS AS CONFIGURAÇÕES ---
  @Get('banner')
  async getBanner() {
    return this.prisma.aboutUs.findUnique({ where: { id: 'main-config' } });
  }
}
