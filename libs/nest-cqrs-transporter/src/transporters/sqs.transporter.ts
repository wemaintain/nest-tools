import { IEvent } from '@nestjs/cqrs';
import { Transporter } from './transporter';

/**
 * NEST JS Transporter over AWS SQS
 */
export class SQSTransporter extends Transporter {

  public async publish(event: IEvent): Promise<void> {
    //
  }
}