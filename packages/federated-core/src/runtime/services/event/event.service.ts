import { FederatedEvent } from '../../../types'

const eventStore: Map<string, any> = new Map()

export const unregister = (id: string) => {
  if (eventStore.has(id)) {
    const { type, fn } = eventStore.get(id);
    window.removeEventListener(type, fn);
    eventStore.delete(id);
  }
};

export const register = (type: string, fn: (event: Event) => void) => {
  const id = `${type}__${Date.now()}__${Math.floor(Math.random() * 1000)}`;

  eventStore.set(id, fn);
  window.addEventListener(type, fn);

  return unregister(id);
};

export const emit = <EventType extends FederatedEvent<string, unknown>>({ type, payload = {} }: EventType): void => {
  window.dispatchEvent(new CustomEvent<EventType>(type, payload as object));
};

export const unregisterAll = () => {
    eventStore.forEach((value, key) => {
        unregister(key);
    });
};
