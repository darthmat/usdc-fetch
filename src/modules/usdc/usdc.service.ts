import {
  IBlockchain,
  UsdcTransfer,
} from '@/infra/blockchain/blockchain.interface';
import { EntityNotFoundError, RpcError } from '@/utils/errors';
import { Injectable } from '@nestjs/common';

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
