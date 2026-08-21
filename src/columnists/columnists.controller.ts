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
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

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
        destination: (req, file, cb) => {
          const uploadPath = join(
            process.env.UPLOAD_DIR || join(process.cwd(), 'uploads'),
            'colunistas',
          );
          if (!existsSync(uploadPath))
            mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
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
    const publicUrl = process.env.PUBLIC_UPLOAD_URL || 'http://localhost:3001';
    const photoUrl = file
      ? `${publicUrl}/uploads/colunistas/${file.filename}`
      : undefined;

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
