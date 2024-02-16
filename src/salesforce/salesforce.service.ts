import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as jsforce from 'jsforce';

@Injectable()
export class SalesforceService implements OnModuleInit {
  private conn: jsforce.Connection;

  constructor(
    private configService: ConfigService,
    @InjectQueue('salesforce-events') private salesforceEventsQueue: Queue,
  ) {
    this.conn = new jsforce.Connection({
      loginUrl: this.configService.get('SALESFORCE_LOGIN_URL'),
    });
  }

  async onModuleInit() {
    await this.conn.login(
      this.configService.get('SALESFORCE_USERNAME'),
      this.configService.get('SALESFORCE_PASSWORD') +
        this.configService.get('SALESFORCE_TOKEN'),
      (err: Error) => {
        if (err) {
          console.error(err);
          return;
        }
        this.subscribeToTopic();
      },
    );
  }

  private subscribeToTopic() {
    const topic = this.conn.streaming.topic('/data/AccountChangeEvent');
    const subscription = topic.subscribe(async (message) => {
      console.log('Received message from Salesforce:', message);
      // Enqueue the message for processing
      await this.salesforceEventsQueue.add(message);
    });
    console.log(
      'Subscribed to CreatedProduct topic in Salesforce',
      subscription._channels,
    );
  }
}
