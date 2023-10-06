import { AppModule } from '../src/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { GenericEventHandler } from '../src/handler/generic.event-handler';
import { GenericEvent } from '../src/event/generic.event';
import { v4 } from 'uuid';
import { waitForEventHandlerExecution } from './utils/wait-for-event-handler-execution.helper';
import { SqsEvent } from '../src/event/sqs.event';

describe('Events', () => {
  let app: TestingModule;
  let eventBus: EventBus;
  let handler: GenericEventHandler

  beforeAll(async() => {
    app = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    await app.init()
    eventBus = await app.resolve(EventBus)
    handler = await app.resolve(GenericEventHandler)
  })

  it('should handle emitted event', async() => {
    const handlerSpy = waitForEventHandlerExecution(handler)
    eventBus.publish(new GenericEvent(v4()))
    expect( await handlerSpy).toHaveBeenCalledTimes(1)
  })
  it('should handle emitted event through custom transporter', async () => {
    eventBus.publish(new SqsEvent(v4()))
  })
  it.todo('should handleFailure when the handler throws')


})