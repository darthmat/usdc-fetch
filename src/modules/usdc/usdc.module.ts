import { Module } from '@nestjs/common';
import { UsdcController } from './usdc.controller';
import { UsdcService } from './usdc.service';

@Module({
  imports: [],
  controllers: [UsdcController],
  providers: [UsdcService],
})
export class UsdcModule {}
