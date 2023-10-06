import { Transport } from '@wemaintain/nest-cqrs-transporter/decorators';
import { SQSTransporter } from '@wemaintain/nest-cqrs-transporter';

/**
 * A generic event to emit over SQS
 */
@Transport(SQSTransporter)
export class SqsEvent {

  constructor(public id: string) {
  }

}