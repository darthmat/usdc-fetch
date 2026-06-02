import { IBlockchain, UsdcTransfer } from './blockchain.interface';

export class FakeBlockchainService implements IBlockchain {
  private transfers = new Map<bigint, UsdcTransfer[]>();
  private error: Error | null = null;

  async getUsdcTransfers(blockNumber: bigint): Promise<UsdcTransfer[]> {
    if (this.error) throw this.error;
    return this.transfers.get(blockNumber) ?? [];
  }

  setTransfers(blockNumber: bigint, transfers: UsdcTransfer[]): void {
    this.transfers.set(blockNumber, transfers);
  }

  setError(error: Error): void {
    this.error = error;
  }
}
