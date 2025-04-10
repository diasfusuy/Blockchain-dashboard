import { Network, Alchemy } from "alchemy-sdk";
import { AlchemyProvider, WebSocketProvider } from "ethers";

const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

const settings = {
  apiKey: ALCHEMY_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

export const httpProvider = new AlchemyProvider("homestead", ALCHEMY_KEY);
export const wsProvider = new WebSocketProvider(
  `wss://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
);

export { alchemy };
