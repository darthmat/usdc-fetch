import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { config } from '@/config';

export const viemClient = createPublicClient({
  chain: mainnet,
  transport: http(config.api.alchemy.url),
});
