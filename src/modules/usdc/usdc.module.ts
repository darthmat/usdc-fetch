import { Module } from '@nestjs/common';
import { UsdcController } from './usdc.controller';
import { UsdcService } from './usdc.service';
import { BlockchainModule } from '@/infra/blockchain.module';

@Module({
  imports: [BlockchainModule],
  controllers: [UsdcController],
  providers: [UsdcService],
})
export class UsdcModule {}
