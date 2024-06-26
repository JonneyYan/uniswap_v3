import { ChainId, SOCKS_CONTROLLER_ADDRESSES, Token } from '@jaguarswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'
import { useTokenBalance } from 'state/connection/hooks'

// technically a 721, not an ERC20, but suffices for our purposes
const SOCKS = new Token(ChainId.X1, SOCKS_CONTROLLER_ADDRESSES[ChainId.X1], 0)

export function useHasSocks(): boolean | undefined {
  const { account, chainId } = useWeb3React()

  const balance = useTokenBalance(account ?? undefined, chainId === ChainId.X1 ? SOCKS : undefined)

  return useMemo(() => Boolean(balance?.greaterThan(0)), [balance])
}
