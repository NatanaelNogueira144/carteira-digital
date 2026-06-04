import { Test, TestingModule } from '@nestjs/testing';
import { GainsController } from './gains.controller';
import { GainsService } from './gains.service';

describe('GainsController', () => {
  let controller: GainsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GainsController],
      providers: [GainsService],
    }).compile();

    controller = module.get<GainsController>(GainsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
