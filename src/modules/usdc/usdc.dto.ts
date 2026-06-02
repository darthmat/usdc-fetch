import { IsNumberString } from 'class-validator';

export class GetBlockTransfersDto {
  @IsNumberString()
  blockNumber!: string;
}
