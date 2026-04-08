import { Module } from '@nestjs/common';
import { ArtigosController } from './artigos.controller';
import { ArtigosService } from './artigos.service';

@Module({
  controllers: [ArtigosController],
  providers: [ArtigosService]
})
export class ArtigosModule {}
