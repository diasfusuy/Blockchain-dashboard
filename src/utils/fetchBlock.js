import {alchemy, httpProvider} from "./alchemy";

const LINK_TOKEN_ADDRESS = "0x514910771AF9Ca656af840dff83E8264EcF986CA";

export async function fetchBlockData(blockNumber) {
  const block = await httpProvider.getBlock(blockNumber);
  if (!block) return null;

  const transfers = await alchemy.core.getAssetTransfers({
    fromBlock: blockNumber,
    toBlock: blockNumber,
    category: ["erc20"],
    contrqctAddresses: [LINK_TOKEN_ADDRESS],
    withMetadata: false,
  });

  const totalVolume = transfers.transfers.reduce((sum, tx) =>{
    return sum + parseFloat(tx.value || "0");
  }, 0);

  return {
    number: blockNumber,
    timestamp: block.timestamp,
    baseFeePerGas: block.baseFeePerGas || 0n,
    gasUsed: block.gasUsed,
    gasLimit: block.gasLimit,
    erc20Volume: totalVolume,
    };
}