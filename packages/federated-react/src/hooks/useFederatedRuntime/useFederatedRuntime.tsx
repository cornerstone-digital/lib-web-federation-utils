import { FederatedRuntimeType } from '@vf/federated-core';

const useFederatedRuntime = (): FederatedRuntimeType => {
  const federatedRuntime = window.__FEDERATED_CORE__.federatedRuntime;
  if (!federatedRuntime) {
    throw new Error('Federated runtime not found');
  }

  return federatedRuntime;
};

export default useFederatedRuntime;
