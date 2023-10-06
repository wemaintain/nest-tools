import { IEvent } from '@nestjs/cqrs';

export abstract class Transporter {

  public abstract publish(event: IEvent): Promise<void>;
}