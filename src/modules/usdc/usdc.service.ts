import {
  IBlockchain,
  UsdcTransfer,
} from '@/infra/blockchain/blockchain.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsdcService {
  constructor(private readonly blockchain: IBlockchain) {}
  async getBlockTransfers(blockNumber: bigint): Promise<UsdcTransfer[]> {
    return await this.blockchain.getUsdcTransfers(blockNumber);
  }
}
