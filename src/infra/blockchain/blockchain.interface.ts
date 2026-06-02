export abstract class IBlockchain {
  abstract getUsdcTransfers(blockNumber: bigint): Promise<UsdcTransfer[]>;
}

export interface UsdcTransfer {
  from: string;
  to: string;
  value: string;
  transactionHash: string;
}
