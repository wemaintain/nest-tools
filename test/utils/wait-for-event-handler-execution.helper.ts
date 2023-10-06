import { IEventHandler } from '@nestjs/cqrs'
import SpyInstance = jest.SpyInstance

type SpyOf<Fn extends (...args: any[]) => any> = SpyInstance<ReturnType<Fn>, Parameters<Fn>>

/**
 * Helper method to spy on NestJS CQRS EventHandler execution
 * Those handlers are async and need to be "watched"
 *
 * This helper aims to provide a basic way to spy them
 *
 * @example
 * ```typescript
 *
 * beforeAll(() => {
 *   // ...
 *   const handler = await app.resolve(DispatchMyEvent)
 *   const controller = await app.resolve(SomethingImportantThatDispatchMyEvent)
 * })
 *
 * it('Should handle my event', async () => {
 *   const waitForDispatchMyEvent = waitForEventHandlerExecution(handler)
 *   await controller.doSomthingImportant()
 *
 *   // Where the magic happen
 *   const spyDipatchMyEvent = await waitForDispatchMyEvent
 *   expect(spyDipatchMyEvent).toHaveBeenCalledTimes(1)
 * })
 * ```
 * @param handler The EventHandler instance
 * @param options Watcher options, optional
 * @param options.timeout Expected timeout in ms, default to 4000ms
 * @param options.nbCalls Number of times we expect the handler to be executed
 * @throws When timeout exceeded
 * @returns Promise that resolve to the jest.spyOn(handler, 'handle')
 */
export const waitForEventHandlerExecution = async (
  handler: IEventHandler,
  options?: {
    timeout?: number
    nbCalls?: number
  },
): Promise<SpyOf<IEventHandler['handle']>> => {
  return new Promise((resolve, reject) => {
    const start = new Date().getTime()
    const handlerSpy = jest.spyOn(handler, 'handle')

    const timeout = options?.timeout ?? 4000
    const nbCalls = options?.nbCalls ?? 1

    const itx = setInterval(async () => {
      if (handlerSpy.mock.results.length >= nbCalls) {
        clearInterval(itx)
        await Promise.all(
          handlerSpy.mock.results
            .filter((result) => result.value instanceof Promise)
            .map((result) => result.value),
        )
        return resolve(handlerSpy)
      }

      const duration = new Date().getTime() - start
      if (duration >= timeout) {
        clearInterval(itx)
        return reject(new Error(`Waiting for handler execution exceeded: ${timeout}ms`))
      }
    }, 100)
  })
}