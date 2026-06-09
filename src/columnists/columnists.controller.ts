import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ColumnistsService } from './columnists.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('colunistas')
export class ColumnistsController {
  constructor(private readonly columnistsService: ColumnistsService) {}

  @Get()
  findAll() {
    return this.columnistsService.findAll();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `colunista-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  create(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    // Coloque 'undefined' no lugar de 'null'
    const photoUrl = file ? `/uploads/${file.filename}` : undefined;

    return this.columnistsService.create({
      name: body.name,
      bio: body.bio,
      photoUrl: photoUrl,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.columnistsService.remove(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.columnistsService.findOne(id);
  }
}
