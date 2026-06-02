import { config } from '@/config';
import { Cache } from '@jeengbe/cache';
import { Module } from '@nestjs/common';
import { createRedisCacheAdapter } from '../redis.adapter';
import { createViemClientAdapter } from '../viem.client';
import { ViemBlockchainServiceCached } from './blockchain.cache';
import { IBlockchain } from './blockchain.interface';
import { ViemBlockchainService } from './viem-blockchain.service';

@Module({
  providers: [
    {
      provide: IBlockchain,
      useFactory: () => {
        const redisCacheAdapter = createRedisCacheAdapter(config);

        return new ViemBlockchainServiceCached(
          new ViemBlockchainService(
            createViemClientAdapter(config),
            config.usdc.contractAddress,
          ),
          new Cache(redisCacheAdapter.cacheAdapter),
        );
      },
    },
  ],
  exports: [IBlockchain],
})
export class BlockchainModule {}
