import { GenericEvent } from '../event/generic.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(GenericEvent)
export class GenericEventHandler implements IEventHandler<GenericEvent> {

  /**
   * Handler is triggered when a GenericEvent is emitted
   */
  handle(event: GenericEvent): void {
    // We will throw if no id was provided
    if (!event.id) {
      throw new Error('Event id is required');
    }
  }
}