import { formatUnits, parseAbiItem, PublicClient } from 'viem';
import { IBlockchain, UsdcTransfer } from './blockchain.interface';

export class ViemBlockchainService implements IBlockchain {
  private readonly usdcDecimals = 6;

  constructor(
    private readonly client: PublicClient,
    private readonly contractAddress: string,
  ) {}

  async getUsdcTransfers(blockNumber: bigint): Promise<UsdcTransfer[]> {
    const logs = await this.client.getLogs({
      address: this.contractAddress as `0x${string}`,
      event: parseAbiItem(
        'event Transfer(address indexed from, address indexed to, uint256 value)',
      ),
      fromBlock: blockNumber,
      toBlock: blockNumber,
    });

    return logs.map((log) => {
      const { from, to, value } = log.args;

      return {
        from: from ?? '0x0',
        to: to ?? '0x0',
        value: value ? formatUnits(value, this.usdcDecimals) : '0',
        transactionHash: log.transactionHash,
      };
    });
  }
}
