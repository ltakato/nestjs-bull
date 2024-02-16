import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { sleep } from '../helpers';

@Processor('salesforce-events')
export class SalesforceEventsConsumerService {
  @Process()
  async transcode(job: Job<unknown>) {
    await job.log('processing job...');

    await job.log('waiting 30 seconds...');

    await sleep(10000);
    await job.progress(33);

    await sleep(10000);
    await job.progress(66);

    await sleep(10000);
    await job.progress(100);

    await job.log('job finished!');

    return {};
  }
}
