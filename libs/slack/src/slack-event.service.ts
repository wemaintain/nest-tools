import { createEventAdapter } from "@slack/events-api"
import { Inject, Injectable, Logger, OnApplicationBootstrap, Optional } from "@nestjs/common"
import { SlackModuleOptions, } from "./slack.module"
import { HttpAdapterHost, ModulesContainer } from "@nestjs/core"
import { SlackScanner } from "./slack.scanner"
import { SlackEventAdapter as BadSlackEventAdapter } from "@slack/events-api/dist/adapter"
import { fromEvent } from 'rxjs'
import { tap } from 'rxjs/operators'
import EventEmitter = NodeJS.EventEmitter
import { SLACK_MODULE_OPTION } from './slack.option'

export type SlackEventAdapter = BadSlackEventAdapter & EventEmitter

/**
 * `SlackEventService` wraps the bindings between the slack event hooks
 * and the nest controllers
 * Provided by the SlackModule on before module init it will attach the
 * Slack event emitter to nest's http adapter.
 * OnApplicationBootstrap it will attach the controllers to the event emitter
 */
@Injectable()
export class SlackEventService implements OnApplicationBootstrap {

  protected eventAdapter?: SlackEventAdapter

  protected readonly logger = new Logger(SlackEventService.name)

  constructor(
    @Optional()
    protected readonly httpAdapterHost: HttpAdapterHost,
    @Inject(SLACK_MODULE_OPTION)
    protected readonly options: SlackModuleOptions,
    protected readonly modulesContainer: ModulesContainer,
    protected readonly scanner: SlackScanner,
  ) {
    if (!this.options.signingSecret) {
      this.logger.warn('Not initializing Slack Event Listener without a signing secret')
      return
    }
    this.eventAdapter = createEventAdapter(
      this.options.signingSecret,
      this.options.eventOption
    ) as SlackEventAdapter
    this.attachHttpAdapter()
  }

  /**
   * Attaching controllers to slack event adapter
   */
  public async onApplicationBootstrap(): Promise<void> {
    if (this.eventAdapter) {
      this.attachEventConsumer()
    }
  }

  /**
   * Attaching slack http adapter to nest http instance
   */
  protected attachHttpAdapter(): void {
    const httpAdapter = this.httpAdapterHost?.httpAdapter
    if (!httpAdapter) {
      this.logger.warn('Not initializing Slack Module without a http adapter')
      return
    }
    const app = httpAdapter.getInstance()
    app.use('/slack/events', this.eventAdapter.requestListener())
  }

  /**
   * Finding all the endpoint decorated by an Event decorator
   */
  protected attachEventConsumer(): void {
    const handlerList = this.scanner.scanEventController(this.modulesContainer)
    handlerList.map(handler => {
      this.logger.debug(`Listening on ${ handler.eventName } with ${ handler.controllerName }.${ handler.methodKey }`)
      fromEvent(this.eventAdapter, handler.eventName)
        .pipe(
          tap((data: Record<string, unknown>) =>
            this.logger.debug({ msg: `Received slack event`, ...data })
          )
        )
        .subscribe(data => handler.instance[handler.methodKey](data))
    })
  }


}
