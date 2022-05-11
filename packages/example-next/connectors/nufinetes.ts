import { initializeConnector } from '@web3-react/core'
import { NufinetesConnector } from '@web3-react/nufinetes'
import { URLS } from '../chains'

export const [nufinetes, hooks] = initializeConnector<NufinetesConnector>(
  (actions) =>
    new NufinetesConnector(actions, {
      rpc: [],
    }),
  [818000000, 818000001]
)
