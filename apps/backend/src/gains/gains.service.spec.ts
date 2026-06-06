import { Test, TestingModule } from '@nestjs/testing';
import { GainsService } from './gains.service';

describe('GainsService', () => {
  let service: GainsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GainsService],
    }).compile();

    service = module.get<GainsService>(GainsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
