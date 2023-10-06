import { Injectable, Logger } from '@nestjs/common';
import { EventBus, IEvent } from '@nestjs/cqrs';
import { takeUntil } from 'rxjs/operators';
import { Transporter } from '@wemaintain/nest-cqrs-transporter/index';
import { Subject } from 'rxjs';
import { CQRS_EVENT_TRANSPORTER } from '@wemaintain/nest-cqrs-transporter/constants';
import { ModuleRef } from '@nestjs/core';
import { ConfigService } from '@wemaintain/nest-cqrs-transporter/config';

@Injectable()
export class TransporterManagerService {
  // Todo protected
  public transporters: Transporter[]
  protected destroy$ = new Subject<void>();
  protected logger = new Logger

  constructor(
    protected readonly eventBus: EventBus,
    protected readonly moduleRef: ModuleRef,
    protected readonly config: ConfigService,
  ) {
  }

  public async register(): Promise<void> {
    await this.registerTransporter()
    this.eventBus
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => this.subscriptionDispatcher(event));
  }


  public close(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * For each Transporter, instantiate it and inject in the module
   */
  protected async registerTransporter(): Promise<void> {
    try {
      this.transporters = await Promise.all(this.config.transporters.map(
        (transporter) => this.moduleRef.create(transporter)
      ))
    } catch(err) {
      this.logger.error('Failed to instance the logger', err)
    }
  }

  /**
   * Dispatches a subscription event to the appropriate transporter.
   *
   * @param {IEvent} event - The event to be dispatched.
   * @return {Promise<void>} A promise that resolves when the event is successfully dispatched.
   */
  protected async subscriptionDispatcher(event: IEvent): Promise<void> {
    const eventMetadata = Reflect.getMetadata(CQRS_EVENT_TRANSPORTER, event)
    if (eventMetadata) {
      // TODO investigate for class type lookup instead of relying on property
      const transporter: Transporter | undefined = this.transporters.find((transporter) => transporter.constructor.name === eventMetadata)
      if (transporter) {
        await transporter.publish(event);
      }
    }
  }

}