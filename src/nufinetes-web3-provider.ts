"use strict";

import type WalletConnect from "@walletconnect/client";
import { EventType } from "@ethersproject/abstract-provider";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Web3Provider } from "@ethersproject/providers";
import { Logger } from "@ethersproject/logger";

const logger = new Logger("0.1");
// import { deepCopy, defineReadOnly } from '@ethersproject/properties'

type WalletConnectEvents =
  | "connect"
  | "modal_closed"
  | "display_uri"
  | "call_request_sent"
  | "wc_sessionRequest"
  | "wc_sessionUpdate"
  | "message"
  | "open"
  | "close"
  | "error"
  | "session_update"
  | "disconnect"
  | "response:";

const WalletConnectEventTypes = [
  "connect",
  "modal_closed",
  "display_uri",
  "call_request_sent",
  "wc_sessionRequest",
  "wc_sessionUpdate",
  "message",
  "open",
  "close",
  "error",
  "session_update",
  "disconnect",
];

type WalletConnectKeys = keyof WalletConnect;
type Web3ProviderKeys = keyof Web3Provider;

export type NufinetesExtendWeb3Provider = Web3Provider & {
  INufinetesProvider: WalletConnectProvider;
  wcInstance: WalletConnect;
};

class NufinetesProvider extends WalletConnectProvider {
  readonly wcInstance: WalletConnect;

  constructor(provider: WalletConnect, opt: any) {
    if (provider == null) {
      logger.throwArgumentError("missing provider", "provider", provider);
    }
    super(opt);
    this.wcInstance = provider;
  }
}

class NufinetesWeb3Provider extends Web3Provider {
  readonly INufinetesProvider!: WalletConnectProvider;
  readonly wcInstance!: WalletConnect;

  constructor(provider: WalletConnect, opt: any) {
    if (provider == null) {
      logger.throwArgumentError("missing provider", "provider", provider);
    }
    const INufinetesProvider: WalletConnectProvider = new NufinetesProvider(
      provider,
      { ...opt, qrcode: false }
    );
    super(INufinetesProvider, provider.chainId);

    INufinetesProvider.enable();
    this.wcInstance = provider;
    // if (this.wcInstance.connected) {
    // }

    return new Proxy(this, {
      get(target: NufinetesExtendWeb3Provider, prop: string) {
        if (prop === "on" || prop === "off") {
          const proxiedFunction = (
            method: WalletConnectEvents | EventType,
            callback: (...args: Array<any>) => void
          ) => {
            if (
              WalletConnectEventTypes.includes(method as WalletConnectEvents) ||
              (method as WalletConnectEvents).includes("response:")
            ) {
              return target.wcInstance[prop].call(
                target.wcInstance,
                method as WalletConnectEvents,
                callback
              );
            }
            return target[prop].call(target, method, callback);
          };
          return proxiedFunction;
        } else if (
          target.wcInstance &&
          prop in target.wcInstance &&
          prop !== "constructor" &&
          prop !== "prototype"
        ) {
          return target.wcInstance[prop as WalletConnectKeys];
        }
        return (target as any)[prop as Web3ProviderKeys];
      },
    });
  }
}

export default NufinetesWeb3Provider;
