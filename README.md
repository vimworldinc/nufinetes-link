# Nufinetes-Link

## Version 0.1-Alpha

It is considered Alpha software and may contain bugs or change significantly between patch versions.

1. returns a Nufinetes-Web3-Provider to useProvider method, this customized web3 provider can be both used as a web3 provider and wallet connect instance, it means while you can directly call "send" method on NufinetesWeb3Provider, you can also call "sendCustomRequest" on it.

This unified approach will be more stable than switching between web3-provider and wallet instance.

2. Update connection stability

3. Update qr modal style

# Nufinetes-Link

## Version 0.0.11

1. Add a callback after function updateProvider is done, to ensure update account will be excuted after the provider exactly updated.

2. Fix stability bugs

3. Prevent update provider while nothing changed in update session event.

## Version 0.0.9

1. Add wcInstance property to store wallet connect instance for operation.

2. Initialize providers depends on desiredChainId

## Version 0.0.8

Fix rpc url error while initializing provider

## Version 0.0.7

Add Ethereum-Provider supporting

**New feature**

1. When Nufinetes switched to Eth chain or other EVM compatible chains, Nufinetes-Link will provide a Ethereum-Provider as the "provider" varible. Then EVM compatible requests such as "personal_sign" and "eth_signTypedData_v4" will be supported.

2. Detect Vimworld Dapp language for QR-modal displaying.

**Bug fix**

1. Fixed a modal style issue.

## ------------------------------------------

A [web3-react](https://github.com/NoahZinsmeister/web3-react/) standard connector for Vimworld Dapps

## Introduction

Nufinetes-Link is a connector for connecting your Vimworld dapps and Nufinetes with a simple customizable configuration.

It runs on web3-react/core library, and provides a complete and useful status of the Wallet Connect connection used by our dapps.

The chains currently supported are **VeChain Mainnet and Testnet**, and chains that will be supported in the future will be **BNB Chain , and every other EVM compatible chain.**

## Preview

You can test this library on: xxxxxxxxxxxxxxxxx

## Installation (private library)

1. Install Web3-React core library

```bash
yarn add @web3-react/core@8.0.25-beta.0
```

2.Add nufinetes-link to dapp dependencies

```json
"@vimworldinc/nufinetes-link": "^0.0.4",
```

3.add registry rule to .npmrc

```json
@vimworldinc:registry=https://gitlab.com/api/v4/packages/npm/
//gitlab.com/api/v4/packages/npm/:_authToken=${CI_JOB_TOKEN}
//gitlab.com/api/v4/projects/35991878/packages/npm/:_authToken=${CI_JOB_TOKEN}
```

4.Then you can run `yarn install` and install @vimworldinc/nufinetes-link library.

## Basic Usage

#### create and activate the connector

After installation, you can create a nufinetes connector for your dapp as follows

```js
import { initializeConnector } from "@web3-react/core";
import { NufinetesConnector } from "@vimworldinc/nufinetes-link";

export const [nufinetes, hooks] =
  initializeConnector <
  NufinetesConnector >
  ((actions) =>
    new NufinetesConnector(actions, {
      rpc: [],
    }),
  [818000000, 818000001]);
```

As the codes above shows, initializeConnector exports an array includes **"nufinetes"** and **"hooks"**,

```js
export const [nufinetes, hooks] = initializeConnector<NufinetesConnector> ...
```

**"nufinetes"** is the instance of the connector.
you can attempt to connect eagerly on mount (only try to get connection status, if not conneted, only returns a disconnected status without attempt to connect).

```js
useEffect(() => {
  void nufinetes.connectEagerly();
}, []);
```

While you want to connect the wallet, you can use nufinetes to activate the wallet

```js
await connector.activate(
  desiredChainId === -1 ? undefined : getAddChainParameters(desiredChainId)
);
```

You can pass either a chain id number or an rpc rule object to **connector.activate** method, then the connector will try to connect to your designated network.

and also a deactivate method is provided

```jsx
<button onClick={() => void connector.deactivate()}>Disconnect</button>
```

#### get status of Nufinetes wallet

```js
export const [nufinetes, hooks] = initializeConnector<NufinetesConnector> ...
```

"hooks" is a collection of hooks that provides every kind of wallet status.

```js
const {
  useChainId,
  useAccount,
  useAccounts,
  useError,
  useIsActivating,
  useIsActive,
  useProvider,
} = hooks;
```

- **useChainId:** the chain id of current wallet
- **useAccount** the priority account that current wallet provides
- **useAccounts** all accounts provided by the linked wallet
- **useIsActivating** returns true while the connector is attempting to activate
- **useIsActive** while the connector is activated and current chain id equals the desiredChainId (if provided), returns true to tell dapp that the wallet is connected correctly.
- **useError** returns any error that connector throws
- **useProvider** returns a instance of Wallet Connect.

In the dapps you can freely use these states according to your business.

## Advanced Usages: Web3ReactProvider

#### native provider

a react context provider called Web3ReactProvider is exported by '@web3-react/core'

```js
import { Web3ReactProvider } from "@web3-react/core";
```

You can use this context provider in your app entrance, then to use wallet status everywhere in your dapp

**in entrance components, for example App.tsx**

```jsx
import { Web3ReactHooks, Web3ReactProvider } from "@web3-react/core";
import { NufinetesConnector } from "@vimworldinc/nufinetes-link";
import { MetaMask } from "@web3-react/metamask";
import { hooks as nufinetesHooks, nufinetes } from "../connectors/nufinetes";
import { hooks as metaMaskHooks, metaMask } from "../connectors/metaMask";

const connectors: [
  MetaMask | NufinetesConnector | WalletConnect,
  Web3ReactHooks
][] = [
  [nufinetes, nufinetesHooks],
  [metaMask, metaMaskHooks],
];

export default function ProviderExample() {
  return (
    <Web3ReactProvider
      //1. pass an array of connectors to Web3ReactProvider
      connectors={connectors}
      //2. or pass a connetor as a connectorOverride to the provider, this makes the provider ignore the connectors above and always return connectorOverride as the priority connector
      // connectorOverride={[nufinetes, nufinetesHooks]}
      lookupENS={false}
    >
      ...children components
    </Web3ReactProvider>
  );
}
```

there are two ways to pass available connectors to Web3ReactProvider

1. pass an array of connectors to Web3ReactProvider
   in this way the provider will set all the connectors passed as available connector, and the priority of these connectors is based on the order of the connectors array.
   in the example, nufinetes will be the first priority connector.
   only if nufinetes is disconnected, Web3ReactProvider will seek for MetaMask connection.
2. pass a connetor as a connectorOverride to the provider
   if you passed connectorOverride to provider, the provider will always take this connector as the priority connector, no matter how many other connectors you passed in "connectors" attribute.

**It is important to set 'lookupENS' attribute to false, because currently our nufinetes provider is just an native Wallet Connect instance, lookup for ens name is not supported on it.**

**in children components**

```jsx
import { useWeb3React } from "@web3-react/core";

const CurrentWallet = () => {
  const {
    connector,
    chainId,
    accounts,
    isActivating,
    error,
    account,
    isActive,
    provider,
  } = useWeb3React();

  const handleConnect = () => {
    connector.activate();
  };

  return (
    <div>
      {isActive ? account : <div onClick={handleConnect}>Connect Wallet</div>}
    </div>
  );
};

export default CurrentWallet;
```

web3-react/core also provides a useWeb3React hook for developers to use the web3react context.
In the basic usages showed the methods to get wallet status by each hooks, now you can directly get all wallet status by a single useWeb3React hook, and this hook can be called everywhere !
The useWeb3React hook also exports the connector instance, you can bind some wallet activation actions everywhere in your dapp.

#### custom provider

If you don't want to use the native web3ReactProvider, or you have some customized status in your dapp, you can create your own context to provide any wallet and dapp status you need.

**One way is to create a context that extends native provider**
in entrance component

```jsx
<Web3ReactProvider connectors={connectors} lookupENS={false}>
  <ExtendProvider>
    <DappContent />
  </ExtendProvider>
</Web3ReactProvider>
```

in ExtendProvider

```jsx
import { useWeb3React } from '@web3-react/core'

export const ExtendProvider = ({ children }: { children: ReactNode }) => {
 const { connector, chainId, accounts, isActivating, error, account, isActive, provider } = useWeb3React()
 const [authCode, setAuthCode] = useState('')
 const [signing, setSigning] = useState(false)

 useEffect(()=>{
  setSigning(true)
  // some async function to get authCode by connected account
  getAuthCode(account).then(code => setAuthCode(code)).finally(()=>{
   setSigning(false)
  })
 }, [isActive])

 return (
  <ExtendContext.Provider
   value={{
    account,
    authCode,
    signing
   }}
  >
  {children}
  </ExtendContext.Provider>
 )
})
```

In this example, we used native wallet status in another Context, while the wallet is connected, then the ExtendContext will get the linked account and use it to get an auth token for your dapp.

**Another way is to create a completely new context**
here is an example:

```jsx
export const WalletProvider = ({children}: {children: ReactNode}) => {
 // you can manage your desired wallet type by your state manager
 const walletType = useSelector(selectWalletType)
 const chainCorrect = useSelector(selectChainCorrect)
 const someOtherStatus = useSelector(selectSomeOtherStatus)

 // create a function to get correct connector by current walletType
 const [connector, {useAccount, useProvider, useChainId, useIsActive, useIsActivating, useError, useAccounts}] = getTargetConnector(walletType)
 const account = useAccount()
 const accounts = useAccounts()
 const web3Provider = useProvider()
 const chainId = useChainId()
 const isActive = useIsActive()
 const isActivating = useIsActivating()
 const error = useError()

 const customizedStatus = useMemo(()=>{
  return someOtherStatus && isActive
 }, [someOtherStatus, isActive])

 return (
  <Web3WalletProvider.Provider
   value={{
    account: chainCorrect && account,
    provider: web3Provider,
    currentChainId: chainId,
    isActive: chainCorrect && isActive,
    connector: connector,
    error: error,
    isActivating,
    chainCorrect: chainCorrect,
    walletType,
    customizedStatus: customizedStatus
   }}
  >
  {children}
  </Web3WalletProvider.Provider>
 )
})
```

In this example, you provided all web3React native wallet status, such as 'account', 'isActive' or 'provider', and you created some new wallet status like 'walletType', 'chainCorrect' or any 'customizedStatus'. Managing multiple wallet connections and their status will be very easy!
