import { isBrowser } from './utils/environment';

export * from './utils';
export * from './types';
export * from './runtime';

if (isBrowser && !window.__FEDERATED_CORE__) {
  // eslint-disable-next-line no-console
  window.__FEDERATED_CORE__ = {
    moduleBaseUrls: {},
  };
}
