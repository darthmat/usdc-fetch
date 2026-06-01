import { Injectable } from '@nestjs/common';

@Injectable()
export class UsdcService {
  async getBlockTransfers(blockNumber: bigint): Promise<string> {
    return `Transfers for block ${blockNumber}`;
  }
}
