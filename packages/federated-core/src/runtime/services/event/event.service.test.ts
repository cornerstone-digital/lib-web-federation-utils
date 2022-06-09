import { FederatedEventKeys } from '../../FederatedRuntime.types'
import eventService from './event.service'

let dispatchedEventCount: Record<string, number> = {}
window.dispatchEvent = jest.fn().mockImplementation((event: Event) => {
  console.log('dispatchEvent', event)
  dispatchedEventCount[event.type] = dispatchedEventCount[event.type]
    ? dispatchedEventCount[event.type] + 1
    : 1
})

describe('eventService', () => {
  const type: FederatedEventKeys = 'federated-core:runtime:started'
  const fn = () => {
    console.log('test')
  }

  beforeEach(() => {
    eventService.clear()
    jest.resetAllMocks()

    window.dispatchEvent = jest.fn().mockImplementation((event: Event) => {
      dispatchedEventCount[event.type] = dispatchedEventCount[event.type]
        ? dispatchedEventCount[event.type] + 1
        : 1
    })

    dispatchedEventCount = {}
  })

  describe('constructor', () => {
    it('should create an event service', () => {
      expect(eventService).toBeDefined()
      expect(eventService.eventStore).toBeDefined()
    })
    it('should have an empty map', () => {
      expect(eventService.eventStore.size).toBe(0)
    })
  })

  describe('register', () => {
    it('should register an event', () => {
      jest.spyOn(window, 'addEventListener')

      eventService.register(type, fn)
      expect(window.addEventListener).toHaveBeenCalledWith(type, fn)
    })

    it('should return a unregister function', () => {
      jest.spyOn(window, 'removeEventListener')
      const unregister = eventService.register(type, fn)
      expect(unregister).toBeInstanceOf(Function)

      unregister()
      expect(window.removeEventListener).toHaveBeenCalledWith(type, fn)
    })

    it('should replace ${moduleKey} in eventKey when passed module params', () => {
      jest.spyOn(window, 'addEventListener')

      eventService.register(
        'federated-core:module:%moduleKey%:before-load',
        fn,
        { scope: 'test-scope', name: 'test-module' }
      )
      expect(window.addEventListener).toHaveBeenCalledWith(
        'federated-core:module:test-scope:test-module:before-load',
        fn
      )
    })
  })
  describe('unregister', () => {
    it('should unregister an event', () => {
      jest.spyOn(window, 'removeEventListener')
      eventService.eventStore.set('test-event-unregister-id', { type, fn })
      eventService.unregister('test-event-unregister-id')
      expect(window.removeEventListener).toHaveBeenCalledWith(type, fn)

      const unregister = eventService.register(type, fn)
      expect(window.addEventListener).toHaveBeenCalledWith(type, fn)

      unregister()
      expect(window.removeEventListener).toHaveBeenCalledWith(type, fn)
    })

    it('should not call removeEventListener for unregistered event', () => {
      jest.spyOn(window, 'removeEventListener')

      eventService.unregister('unregistered-event-id')
      expect(window.removeEventListener).not.toHaveBeenCalledWith(type, fn)
    })
  })

  describe('unregisterAll', () => {
    it('should unregister all events', () => {
      jest.spyOn(window, 'removeEventListener')

      eventService.eventStore.set('test-event-id', { type, fn })
      eventService.eventStore.set('test-event-id2', { type, fn })

      eventService.unregisterAll()
      expect(window.removeEventListener).toHaveBeenCalledTimes(2)
      expect(eventService.eventStore.size).toBe(0)
    })
  })

  describe('emit', () => {
    it('should emit an event', () => {
      eventService.emit(type, {
        modules: [{ scope: 'test-scope', name: 'test-module-1' }],
      })
      expect(dispatchedEventCount).toEqual({
        [type]: 1,
      })
    })

    it('should replace ${moduleKey} in eventKey when passed module params', () => {
      jest.spyOn(window, 'addEventListener')
      const module = { scope: 'test-scope', name: 'test-module' }

      eventService.emit(
        'federated-core:module:%moduleKey%:before-load',
        { module },
        module
      )
      expect(dispatchedEventCount).toEqual({
        'federated-core:module:test-scope:test-module:before-load': 1,
      })
    })
  })
})
