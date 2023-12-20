import Web3 from "web3";

export const injectedProvider = (window as any)?.ethereum;
export const isInjectedProvider = typeof injectedProvider !== "undefined";
export const web3 = new Web3(injectedProvider);
