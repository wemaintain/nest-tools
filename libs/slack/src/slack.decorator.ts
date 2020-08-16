export const SLACK_EVENT_PARAM = 'slack:event:param'

/**
 * Subscribes to incoming events which fulfils chosen pattern.
 */
export const SlackEvent = (eventParam: string|SlackEventParam): MethodDecorator => {
  return (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    let param: Record<string, unknown>
    if(typeof eventParam === 'string') {
      param = {
        eventName: eventParam,
      }
    } else {
      param = {
        ...eventParam,
      }
    }
    param.callback = descriptor.value
    Reflect.defineMetadata(SLACK_EVENT_PARAM, param, descriptor.value)
    return descriptor
  }
}

export interface SlackEventParam {
  eventName: string
}
