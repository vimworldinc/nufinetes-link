## Version 0.2.10

1. remove legacy connectors
2. update wc2 sdk version
3. adjust custom ethereum provider as newest wc2 version

## Version 0.2.9

1. optimize desktop redirect
## Version 0.2.8

1. update walletconnect v2 libs to newest
## Version 0.2.7

1. update walletconnect v2 libs to newest

## Version 0.2.4

1. fix desktop link issue

## Version 0.2.3

1. export both v1 and v2 connectors for dapp usage

## Version 0.2.2

1. update connector name

## Version 0.2.1

1. use @walletconnect/utils@2.4.7
## Version 0.2

1. Upgrade Wallet Connect to V2 version
2. Upgrade web3-react version

## Version 0.1.22

1. Use saveMobileLinkInfo in linking
## Version 0.1.20

1. Update universal link on iOS modal

## Version 0.1.16

1. Update getBestRpc func

## Version 0.1.15

1. Add android deeplink setting

## Version 0.1.14

1.  Add wallet connect target deeplink to redirect Nufi-app while signing or connecting

2.  While user is using iOS Chrome to browse DApp, send a param to tell Nufintes to redirect back while signing or connecting

## Version 0.1.11

1. Adjust modal display type on mobile devices

## Version 0.1.10

1. Add error collection enum

2. Throw errors while no rpc url provided for connecting chainId

## Version 0.1.7

1. Update uri to support open Nufinetes by system camera

## Version 0.1.6

1. Update new style of connection modal

## Version 0.1.5

1. Add an option to show original qr code modal

## Version 0.1.4

1. fix a bug about account update issue

2. remove console in qrcode modal

## Version 0.1-Alpha

**It is considered Alpha software and may contain bugs or change significantly between patch versions.**

1. useProvider method will return a Nufinetes-Web3-Provider, this customized web3 provider can be both used as a web3 provider and Wallet Connect instance, it means that while you can directly call "send" method on NufinetesWeb3Provider, you can also call "sendCustomRequest" on it.

This unified approach will be more stable than switching between web3-provider and wallet instance.

2. Update connection stability.

3. Update qr modal style.

## Version 0.0.11

1. Add a callback after function updateProvider is done, to ensure update account will be excuted after the provider exactly updated.

2. Fix stability bugs.

3. Prevent update provider while nothing changed in update session event.

## Version 0.0.9

1. Add wcInstance property to store wallet connect instance for operation.

2. Initialize providers depends on desiredChainId.

## Version 0.0.8

Fix rpc url error while initializing provider.

## Version 0.0.7

Add Ethereum-Provider supporting.

**New feature**

1. When Nufinetes switched to Eth chain or other EVM compatible chains, Nufinetes-Link will provide a Ethereum-Provider as the "provider" varible. Then EVM compatible requests such as "personal_sign" and "eth_signTypedData_v4" will be supported.

2. Detect Vimworld Dapp language for QR-modal displaying.

**Bug fix**

1. Fixed a modal style issue.
