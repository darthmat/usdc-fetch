import { RpcError } from '@/utils/errors';
import { Injectable } from '@nestjs/common';
import { IBlockchain, UsdcTransfer } from '../blockchain/blockchain.interface';

@Injectable()
export class UsdcService {
  constructor(private readonly blockchain: IBlockchain) {}

  async getBlockTransfers(blockNumber: bigint): Promise<UsdcTransfer[]> {
    const transfers = await this.blockchain
      .getUsdcTransfers(blockNumber)
      .catch((error: unknown) => {
        throw new RpcError(
          'Failed to fetch USDC transfers from blockchain.',
          error,
        );
      });

    if (!transfers.length) return [];

    return transfers;
  }
}
