import { Controller, Get, Param } from '@nestjs/common';
import { GetBlockTransfersDto } from './usdc.dto';
import { UsdcService } from './usdc.service';

@Controller('usdc')
export class UsdcController {
  constructor(private readonly usdcService: UsdcService) {}

  @Get('transfers/:blockNumber')
  async getTransfers(@Param() params: GetBlockTransfersDto) {
    return await this.usdcService.getBlockTransfers(BigInt(params.blockNumber));
  }
}
