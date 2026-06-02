import { Cache } from '@jeengbe/cache';
import { IBlockchain, UsdcTransfer } from './blockchain.interface';

export type ItadApiCacheTypes = Record<
  `usdc-transfer-block:${bigint}`,
  UsdcTransfer[]
>;

export class ViemBlockchainServiceCached implements IBlockchain {
  constructor(
    private readonly delegate: IBlockchain,
    private readonly cache: Cache<ItadApiCacheTypes>,
  ) {}

  async getUsdcTransfers(blockNumber: bigint): Promise<UsdcTransfer[]> {
    return await this.cache.cached(
      `usdc-transfer-block:${blockNumber}`,
      () => this.delegate.getUsdcTransfers(blockNumber),
      '1y',
    );
  }
}
