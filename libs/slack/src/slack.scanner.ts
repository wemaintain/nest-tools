import { MetadataScanner, ModulesContainer, Reflector } from "@nestjs/core";
import { SLACK_EVENT_PARAM } from "./slack.decorator";
import { InstanceWrapper } from "@nestjs/core/injector/instance-wrapper";
import { Controller } from "@nestjs/common/interfaces";
import { Injectable } from '@nestjs/common'

/**
 * `SlackScanner` handle the analyse of the Nest Container
 * In order to find the SlackModule decorator in the nest application
 */
@Injectable()
export class SlackScanner {

  protected readonly reflector = new Reflector()
  protected readonly metadataScanner = new MetadataScanner()

  /**
   * Return the lost of methods with a @SlackEvent decorator
   */
  public scanEventController(
    modules: ModulesContainer,
  ): NestSlackEventHandler[] {
    return [...modules.values()]
      .reduce((acc, module) => ([...acc, ...module.controllers.values()]), [])
      .reduce((acc, controller) => ([
        ...acc, ...this.filterController(controller)
      ]), [])
  }


  /**
   * Register the SQSQueue of the provided controller
   * @param instanceWrapper
   */
  protected filterController(
    instanceWrapper: InstanceWrapper<Controller>,
  ): NestSlackEventHandler[] {
    const { instance } = instanceWrapper
    if (!instance) {
      return
    }
    // Export controller
    const instancePrototype = Object.getPrototypeOf(instance)
    return this
      .metadataScanner
      .scanFromPrototype<Controller, NestSlackEventHandler|void>(
        instance,
        instancePrototype,
        method => this.hasSlackMetadata(
          instance,
          instancePrototype,
          method,
        ),
      ) as NestSlackEventHandler[]
  }

  protected hasSlackMetadata(
    instance: any,
    instancePrototype: any,
    methodKey: string,
  ): NestSlackEventHandler|void {
    const methodInstance = instancePrototype[methodKey]
    const metadata = Reflect.getMetadata(SLACK_EVENT_PARAM, methodInstance)
    if (metadata?.eventName) {
      return {
        methodKey,
        eventName: metadata?.eventName,
        instance,
        controllerName: instancePrototype.name
      }
    }
  }

}

export interface NestSlackEventHandler {
  methodKey: string
  eventName: string
  controllerName: string
  instance: any
}
