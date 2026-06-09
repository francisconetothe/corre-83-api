import { Module } from '@nestjs/common';
import { ColumnistsService } from './columnists.service';
import { ColumnistsController } from './columnists.controller';

@Module({
  providers: [ColumnistsService],
  controllers: [ColumnistsController]
})
export class ColumnistsModule {}
