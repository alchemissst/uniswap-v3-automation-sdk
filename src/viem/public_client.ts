import { ApertureSupportedChainId, getChainInfo } from '@/index';
import { providers } from 'ethers';
import type { TransactionRequest, Transport } from 'viem';
import { PublicClient, createPublicClient, http } from 'viem';
import { publicActionsL2 } from 'viem/op-stack';

/**
 * Creates a Viem public client for the specified chain id.
 * @param chainId chain id must be supported by Aperture's UniV3 Automation platform.
 * @param rpc_url rpc_url.
 * @returns A multicall-enabled public client.
 */
export function getPublicClient(
  chainId: ApertureSupportedChainId,
  rpc_url?: string,
): PublicClient {
  return createPublicClient({
    batch: {
      multicall: true,
    },
    chain: getChainInfo(chainId).chain,
    transport: http(rpc_url ?? getChainInfo(chainId).rpc_url),
  });
}

export function publicClientToProvider(client: PublicClient) {
  const { chain, transport } = client;
  const network = {
    chainId: chain!.id,
    name: chain!.name,
    ensAddress: chain!.contracts?.ensRegistry?.address,
  };
  if (transport.type === 'fallback')
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<Transport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network),
      ),
    );

  return new providers.StaticJsonRpcProvider(transport.url, network);
}

export async function estimateTotalGas(
  tx: TransactionRequest,
  client: PublicClient,
) {
  const l2Client = client.extend(publicActionsL2());
  const { from, to, value, data } = tx;
  return l2Client.estimateTotalGas({
    account: from,
    to,
    value,
    data,
    chain: client.chain,
  });
}
