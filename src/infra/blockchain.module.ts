import { config } from '@/config';
import { Module } from '@nestjs/common';
import { ViemBlockchainService } from './viem-blockchain.service';
import { IBlockchain } from './blockchain.interface';
import { viemClient } from './viem.client';

@Module({
  providers: [
    {
      provide: IBlockchain,
      useFactory: () => {
        return new ViemBlockchainService(
          viemClient,
          config.usdc.contractAddress,
        );
      },
    },
  ],
  exports: [IBlockchain],
})
export class BlockchainModule {}
