import { SlackEventService } from './slack-event.service'
import { HttpAdapterHost, ModulesContainer } from '@nestjs/core'
import { NestSlackEventHandler, SlackScanner } from '@wemaintain/slack/slack.scanner'

describe('SlackEventService', () => {

  let mockHttpAdapter: HttpAdapterHost
  let mockScanner: SlackScanner
  let use
  let mockHandler: NestSlackEventHandler

  beforeEach(() => {
    jest.clearAllMocks()
    use = jest.fn()
    mockHttpAdapter = {
      httpAdapter: {
        getInstance: jest.fn(() => ({
          use
        }))
      }
    } as unknown as HttpAdapterHost

    mockHandler = {
      methodKey: 'foo',
      eventName: 'bar',
      controllerName: 'class',
      instance: {
        foo: jest.fn(),
      },
    }

    mockScanner = ({
      scanEventController: jest.fn().mockImplementation(() => ([
        mockHandler
      ]))
    }) as unknown as SlackScanner
  })

  describe('constructor', () => {
    it('should work when signingSecret is provided', () => {
      const service = new SlackEventService(
        mockHttpAdapter,
        { signingSecret: 'foo' },
        new Map() as ModulesContainer,
        mockScanner
      )
      expect(use).toHaveBeenCalledTimes(1)
      service.onApplicationBootstrap()
      service['eventAdapter'].emit(mockHandler.eventName)
      expect(mockHandler.instance.foo).toHaveBeenCalledTimes(1)
    })

    it('should be disable when signingSecret is not provided', () => {
      const service = new SlackEventService(
        mockHttpAdapter,
        { },
        new Map() as ModulesContainer,
        mockScanner
      )
      expect(use).toHaveBeenCalledTimes(0)
      service.onApplicationBootstrap()
    })
  })
})
