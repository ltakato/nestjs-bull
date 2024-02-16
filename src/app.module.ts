import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SalesforceService } from './salesforce/salesforce.service';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { SalesforceEventsConsumerService } from './salesforce-events-consumer/salesforce-events-consumer.service';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the config globally available
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'salesforce-events',
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    BullBoardModule.forFeature({
      name: 'salesforce-events',
      adapter: BullMQAdapter, //or use BullAdapter if you're using bull instead of bullMQ
    }),
  ],
  controllers: [AppController],
  providers: [AppService, SalesforceService, SalesforceEventsConsumerService],
})
export class AppModule {}
