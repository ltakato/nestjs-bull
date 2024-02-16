import { Test, TestingModule } from '@nestjs/testing';
import { SalesforceEventsConsumerService } from './salesforce-events-consumer.service';

describe('SalesforceEventsConsumerService', () => {
  let service: SalesforceEventsConsumerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesforceEventsConsumerService],
    }).compile();

    service = module.get<SalesforceEventsConsumerService>(SalesforceEventsConsumerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
