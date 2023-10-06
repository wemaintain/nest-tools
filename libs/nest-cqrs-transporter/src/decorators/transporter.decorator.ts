import { CQRS_EVENT_TRANSPORTER } from '@wemaintain/nest-cqrs-transporter/constants';
import { Transporter } from '@wemaintain/nest-cqrs-transporter/transporters';

/**
 * Decorator that sets the transporter for the decorated event.
 * @returns A class decorator.
 */
export function Transport(
  transporter: typeof Transporter
): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: Function) => {
    // Set the event transporter metadata to SQS.
    Reflect.defineMetadata(CQRS_EVENT_TRANSPORTER, transporter.name, target.prototype);
  };
}