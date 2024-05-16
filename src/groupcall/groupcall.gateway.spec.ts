import { Test, TestingModule } from '@nestjs/testing';
import { GroupcallGateway } from './groupcall.gateway';

describe('GroupcallGateway', () => {
  let gateway: GroupcallGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupcallGateway],
    }).compile();

    gateway = module.get<GroupcallGateway>(GroupcallGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
