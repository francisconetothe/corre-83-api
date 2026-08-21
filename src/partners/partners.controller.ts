import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { PartnersService } from './partners.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Controller('parceiros')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Get()
  findAll() {
    return this.partnersService.findAll();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(
            process.env.UPLOAD_DIR || join(process.cwd(), 'uploads'),
            'parceiros',
          );
          if (!existsSync(uploadPath))
            mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `partner-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  create(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    if (!file && !body.logoUrl) {
      throw new BadRequestException('A logomarca do parceiro é obrigatória.');
    }

    const publicUrl = process.env.PUBLIC_UPLOAD_URL || 'http://localhost:3001';
    // Se enviou arquivo, gera URL completa; senão, usa a logoUrl que veio no body
    const logoUrl = file
      ? `${publicUrl}/uploads/parceiros/${file.filename}`
      : body.logoUrl;

    return this.partnersService.create({
      name: body.name,
      website: body.website,
      logoUrl: logoUrl,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partnersService.remove(id);
  }
}
