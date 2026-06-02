import { Config } from '@/config';
import { createPublicClient, http, PublicClient } from 'viem';
import { mainnet } from 'viem/chains';

export function createViemClientAdapter(config: Config): PublicClient {
  return createPublicClient({
    chain: mainnet,
    transport: http(config.api.alchemy.url),
  });
}
