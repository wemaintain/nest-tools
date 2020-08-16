import { Test } from '@nestjs/testing'
import { SlackClient, SlackModule, SlackModuleOptions } from '@wemaintain/slack/slack.module'
import { Module } from '@nestjs/common'
import { SlackEventService } from './slack-event.service'

describe('SlackModule', () => {

  it('Static module instantiation', async () => {
    const testModule = await Test.createTestingModule({
      imports: [SlackModule]
    }).compile()
    const app = testModule.createNestApplication()
    await expect(app.resolve(SlackClient)).resolves.toBeDefined()
    await expect(app.resolve(SlackEventService)).resolves.toBeDefined()
    await expect(app.init()).resolves
  })

  describe('forRoot', () => {
    it('Only WebAPi', async () => {
      const testModule = await Test.createTestingModule({
        imports: [SlackModule.forRoot({})]
      }).compile()
      const app = testModule.createNestApplication()
      await expect(app.resolve(SlackClient)).resolves.toBeDefined()
      await expect(app.resolve(SlackEventService)).resolves.toBeDefined()
      await expect(app.init()).resolves
    })

    it('With event api', async () => {
      const testModule = await Test.createTestingModule({
        imports: [SlackModule.forRoot({
          signingSecret: 'foo'
        })]
      }).compile()
      const app = testModule.createNestApplication()
      await expect(app.resolve(SlackClient)).resolves.toBeDefined()
      await expect(app.resolve(SlackEventService)).resolves.toBeDefined()
      await expect(app.init()).resolves
    })

  })

  describe('forRootASync', () => {

    const serviceValue: SlackModuleOptions = {}
    const ConfigService = Symbol('ConfigService')
    @Module({
      providers: [
        {
          provide: ConfigService,
          useFactory: () => serviceValue
        }
      ],
      exports: [ConfigService]
    })
    class ParamModule {}

    it('Only WebAPi', async () => {
      const testModule = await Test.createTestingModule({
        imports: [
          ParamModule,
          SlackModule.forRootAsync({
            imports: [ParamModule],
            inject: [ConfigService],
            useFactory: (option) => option
          })
        ]
      }).compile()
      const app = testModule.createNestApplication()
      await expect(app.resolve(SlackClient)).resolves.toBeDefined()
      await expect(app.resolve(SlackEventService)).resolves.toBeDefined()
      await expect(app.init()).resolves
    })

    it('With event api', async () => {
      serviceValue.signingSecret = 'foo'
      const testModule = await Test.createTestingModule({
        imports: [
          ParamModule,
          SlackModule.forRootAsync({
            imports: [ParamModule],
            inject: [ConfigService],
            useFactory: (option) => option
          })
        ]
      }).compile()
      const app = testModule.createNestApplication()
      await expect(app.resolve(SlackClient)).resolves.toBeDefined()
      await expect(app.resolve(SlackEventService)).resolves.toBeDefined()
      await expect(app.init()).resolves
    })

  })

})
