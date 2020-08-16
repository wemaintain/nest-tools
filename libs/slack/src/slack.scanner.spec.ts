import { Controller, Injectable } from '@nestjs/common'
import { SlackModule } from '@wemaintain/slack/slack.module'
import { SlackEvent } from '@wemaintain/slack/slack.decorator'
import { Test } from '@nestjs/testing'
import { SlackEventService } from '@wemaintain/slack/slack-event.service'
import { ModulesContainer } from '@nestjs/core'
import { SlackScanner } from '@wemaintain/slack/slack.scanner'

@Injectable()
class AppService {
  public foo() {}
}

@Controller()
class AppController {

  constructor(
    public readonly service: AppService
  ) {}

  @SlackEvent('*')
  public consumer() {}

  public notConsumer() {}
}

describe('SlackScanner', () => {

  let container: ModulesContainer

  beforeAll(async () => {
    const testModule = await Test.createTestingModule({
      imports: [SlackModule.forRoot({
        signingSecret: 'foo'
      })],
      controllers: [AppController],
      providers: [AppService],
    }).compile()
    const app = await testModule.init()
    const slackEventService = app.get(SlackEventService)
    // Sorry but /shrug
    container = (slackEventService as any)['modulesContainer']
    expect(container).toBeDefined()
  })

  it('scanEventController', async () => {
    const scanner = new SlackScanner()
    const consumers = scanner.scanEventController(container)
    // Checking controllers has been returned
    expect(consumers).toBeDefined()
    expect(consumers).toHaveLength(1)
    const controller: AppController = consumers.shift().instance
    expect(controller).toBeDefined()
    expect(controller.service).toBeDefined()
    // Checking DI
    controller.service.foo()
  })
})
