import { Test, TestingModule } from '@nestjs/testing';
import { ColumnistsController } from './columnists.controller';

describe('ColumnistsController', () => {
  let controller: ColumnistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColumnistsController],
    }).compile();

    controller = module.get<ColumnistsController>(ColumnistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
