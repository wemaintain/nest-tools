import { Controller, Get, Inject } from '@nestjs/common';
import { SlackEvent } from '@wemaintain/slack'
import { AppService } from './app.service';

@Controller()
export class SlackController {

  constructor(
    @Inject(AppService)
    public readonly service: AppService,
  ) {}

  @SlackEvent('message')
  onMessageInChannel(): void {
    this.service.foo()
  }

  @SlackEvent('app_home_opened')
  onEventHomeOpen(): void {
    this.service.foo()
  }


}
