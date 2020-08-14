import { DynamicModule, Module, ModuleMetadata, Provider } from '@nestjs/common';
import { WebClient, WebClientOptions } from '@slack/web-api'
import { createEventAdapter } from '@slack/events-api'

export const SlackClient = Symbol('SLACK_SERVICE')
export const SlackEvent = Symbol('SlackEvent')
const SLACK_MODULE_OPTION = Symbol('SLACK_MODULE_OPTION')


@Module({
  providers: [
    {
      provide: SlackClient,
      useFactory: () => new WebClient(),
    },slac
  ],
  exports: [
    SlackClient
  ],
})
export class SlackModule {

  forRoot(option: SlackModuleOptions): DynamicModule {
    return {
      module: SlackModule,
      providers: [
        {
          provide: SlackClient,
          useFactory: (option) => new WebClient(
            option.token,
            option
          )
        }
      ]
    }

  }
  forRootAsync(options: SlackModuleAsyncOption): DynamicModule {
    return {
      module: SlackModule,
      imports: options.imports,
      providers: [
        this.createAsyncOptionsProvider(options),
      ],
      exports: []
    }
  }

  private createAsyncOptionsProvider(
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
  token: string,
  signingSecret?: string
}
