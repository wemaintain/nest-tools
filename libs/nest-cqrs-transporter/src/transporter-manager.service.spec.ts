import { BehaviorSubject } from 'rxjs';
import { Transporter } from '@wemaintain/nest-cqrs-transporter/transporters';
import { EventBus } from '@nestjs/cqrs';
import { Transport } from '@wemaintain/nest-cqrs-transporter/decorators';
import { TransporterManagerService } from '@wemaintain/nest-cqrs-transporter/transporter-manager.service';
import { ModuleRef } from '@nestjs/core';

class NoOpTransporter extends Transporter {
  public transporterMetadataKey: 'metadataKey'
  public publish = jest.fn()
}

describe('TransporterManagerService', () => {

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should subscribe to event bus and dispatch events to subscriptionDispatcher', async() => {
    // Arrange
    const eventBusMock = new BehaviorSubject(null)

    @Transport(NoOpTransporter)
    class MockEvent {}

    const service = new TransporterManagerService(
      eventBusMock as unknown as EventBus,
      { create: (module) => Promise.resolve(new module()) } as unknown as ModuleRef,
      {
        transporters: [NoOpTransporter]
      }
    );
    const eventMock = new MockEvent()
    const observableSpy = jest.spyOn(eventBusMock, 'subscribe')

    // Act
    await service.register()
    eventBusMock.next(eventMock);

    // Assert
    expect(observableSpy).toHaveBeenCalled();
    expect(service.transporters[0].publish).toHaveBeenCalledWith(eventMock);
  });

  it('should not dispatch any events to subscriptionDispatcher', async () => {
    // Arrange
    const eventToNotPublish = new class NoTransporterEvent {}
    const eventBusMock = new BehaviorSubject(null)

    const service = new TransporterManagerService(
      eventBusMock as unknown as EventBus,
      { create: (module) => new module } as unknown as ModuleRef,
      {
        transporters: [NoOpTransporter]
      },
    )
    const observableSpy = jest.spyOn(eventBusMock, 'subscribe')

    // Act
    await service.register()
    eventBusMock.next(eventToNotPublish)

    // Assert
    expect(observableSpy).toHaveBeenCalled();
    expect(service.transporters[0].publish).toHaveBeenCalledTimes(0);

  });
})