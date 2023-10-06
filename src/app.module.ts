import { Module } from '@nestjs/common';
import { SlackController } from './slack.controller';
import { SlackModule } from '@wemaintain/slack';
import { AppService } from './app.service';
import { GenericEventHandler } from './handler/generic.event-handler';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    SlackModule.forRoot({
      signingSecret: process.env.SLACK_SIGN
    }),
    CqrsModule,
  ],
  controllers: [SlackController],
  providers: [AppService, GenericEventHandler],
})
export class AppModule {}