import { Injectable } from "@nestjs/common";
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class AppService {

  constructor(
    public eventBus: EventBus
  ) {
  }

  public foo() {
    return 'bar'
  }

}