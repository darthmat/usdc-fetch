import { Controller, Get, Param } from '@nestjs/common';
import { GetBlockTransfersDto } from './usdc.dto';
import { UsdcService } from './usdc.service';
import { UsdcTransfer } from '../blockchain/blockchain.interface';

@Controller('usdc')
export class UsdcController {
  constructor(private readonly usdcService: UsdcService) {}

  @Get('transfers/:blockNumber')
  async getTransfers(
    @Param() params: GetBlockTransfersDto,
  ): Promise<UsdcTransfer[]> {
    return await this.usdcService.getBlockTransfers(BigInt(params.blockNumber));
  }
}
