import eventService from './event.service'
import { EventMap, FederatedEvents } from '../../FederatedRuntime.types'

let dispatchedEventCount: Record<string, number> = {}
window.dispatchEvent = jest.fn().mockImplementation((event: Event) => {
  dispatchedEventCount[event.type] = dispatchedEventCount[event.type]
    ? dispatchedEventCount[event.type] + 1
    : 1
})

describe('eventService', () => {
  const type = 'federated-core:runtime:started'
  const fn = () => undefined

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

      eventService.register(FederatedEvents.MODULE_BEFORE_LOAD, fn, {
        scope: 'test-scope',
        name: 'test-module',
      })
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
      eventService.emit<EventMap>({
        type: FederatedEvents.RUNTIME_STARTED,
        payload: {
          startTime: Date.now(),
          startEndTime: Date.now() + 1000,
          startDuration: 1000,
        },
      })
      expect(dispatchedEventCount).toEqual({
        [type]: 1,
      })
    })

    it('should replace ${moduleKey} in eventKey when passed module params', () => {
      jest.spyOn(window, 'addEventListener')
      const module = { scope: 'test-scope', name: 'test-module' }

      eventService.emit<EventMap>(
        {
          type: FederatedEvents.MODULE_BEFORE_LOAD,
          payload: { module },
        },
        module
      )
      expect(dispatchedEventCount).toEqual({
        'federated-core:module:test-scope:test-module:before-load': 1,
      })
    })
  })
})
