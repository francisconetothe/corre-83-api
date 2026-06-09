import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { PlansService } from './plans.service';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  create(@Body() data: any) {
    return this.plansService.create(data);
  }

  @Get()
  findAll() {
    return this.plansService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plansService.remove(Number(id));
  }
}