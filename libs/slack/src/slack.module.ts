import { DynamicModule, Module, ModuleMetadata, Provider, Logger } from '@nestjs/common';
import { WebClient, WebClientOptions } from '@slack/web-api'
import { EventAdapterOptions } from '@slack/events-api/dist/adapter';
import { SlackEventService } from './slack-event.service';
import { SlackScanner } from '@wemaintain/slack/slack.scanner'
import { SLACK_MODULE_OPTION } from './slack.option'

export class SlackClient extends WebClient {}

/**
 * SlackModule provide the tooling to integrate a Nest Application
 * as a Slack BOT
 *
 * It exports the following providers:
 *  - {@see SlackClient}: The Slack Client provide the @slack/web-api sdk
 *
 * If a signingSecret is provided to the module, it will also
 * register the @slack/events-api using {@see SlackEvent} decorators
 */
@Module({
  providers: [
    SlackEventService,
    SlackScanner,
    {
      provide: SlackClient,
      useFactory: (optionService) => new WebClient(
        optionService.token,
        optionService
      ),
      inject: [SLACK_MODULE_OPTION]
    },
    {
      provide: SLACK_MODULE_OPTION,
      useValue: {},
    },

  ],
  exports: [
    SlackClient
  ],
})
export class SlackModule {

  protected readonly logger: Logger = new Logger('SlackModule')

  static forRoot(option: SlackModuleOptions): DynamicModule {
    return {
      module: SlackModule,
      providers: [
        {
          provide: SLACK_MODULE_OPTION,
          useValue: option,
        },
      ]
    }
  }

  static forRootAsync(options: SlackModuleAsyncOption): DynamicModule {
    return {
      module: SlackModule,
      imports: options.imports,
      providers: [
        this.createAsyncOptionsProvider(options),
      ],
    }
  }

  private static createAsyncOptionsProvider(
    options: SlackModuleAsyncOption,
  ): Provider {
    return {
      provide: SLACK_MODULE_OPTION,
      useFactory: options.useFactory,
      inject: options.inject || [],
    }
  }

}

export interface SlackModuleAsyncOption extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<SlackModuleOptions> | SlackModuleOptions
  inject?: any[]
}

export interface SlackModuleOptions extends WebClientOptions {
  token?: string
  signingSecret?: string
  eventOption?: EventAdapterOptions
  eventUrl?: string
}
