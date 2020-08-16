import { Module } from '@nestjs/common';
import { SlackController } from './slack.controller';
import { SlackModule } from '@wemaintain/slack';
import { AppService } from './app.service';

@Module({
  imports: [
    SlackModule.forRoot({
      signingSecret: process.env.SLACK_SIGN
    })
  ],
  controllers: [SlackController],
  providers: [AppService],
})
export class AppModule {}
