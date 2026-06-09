import { Test, TestingModule } from '@nestjs/testing';
import { ColumnistsService } from './columnists.service';

describe('ColumnistsService', () => {
  let service: ColumnistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColumnistsService],
    }).compile();

    service = module.get<ColumnistsService>(ColumnistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
