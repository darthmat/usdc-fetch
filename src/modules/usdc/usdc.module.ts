import { BlockchainModule } from '@/infra/blockchain/blockchain.module';
import { Module } from '@nestjs/common';
import { UsdcController } from './usdc.controller';
import { UsdcService } from './usdc.service';

@Module({
  imports: [BlockchainModule],
  controllers: [UsdcController],
  providers: [UsdcService],
})
export class UsdcModule {}
