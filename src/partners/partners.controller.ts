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
import { extname } from 'path';

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
        destination: './uploads', // 👈 Mesma pasta onde ficam suas provas e artigos
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

    // Se salvou o arquivo localmente, gera a URL relativa.
    const logoUrl = file ? `/uploads/${file.filename}` : body.logoUrl;

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
