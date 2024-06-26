import { useMemo } from 'react'
import { Token, usePoolTransactionsQuery } from '../../thegraph/__generated__/types-and-hooks'
import { ApolloError } from '@apollo/client'
import { TableTransaction, V3PoolTransactionType } from '../../data/useV3Transactions'

export function useV3PoolTransactions(
  address: string,
  filter: V3PoolTransactionType[] = [V3PoolTransactionType.SELL, V3PoolTransactionType.BUY, V3PoolTransactionType.BURN, V3PoolTransactionType.MINT],
  token0?: Token
): {
  loading: boolean
  error: ApolloError | undefined
  data: TableTransaction[]
} {
  const { data, loading, error } = usePoolTransactionsQuery({
    variables: {
      address: address,
    },
  })

  const unfilteredTransaction: TableTransaction[] = []

  for (const t of data?.swaps ?? []) {
    unfilteredTransaction.push({
      type: t.pool.token0.id === token0?.id ? V3PoolTransactionType.SELL : V3PoolTransactionType.BUY,
      hash: t.transaction.id,
      timestamp: t.timestamp,
      origin: t.origin,
      token0: {
        id: t.pool.token0.id,
        name: t.pool.token0.name,
        symbol: t.pool.token0.symbol,
        amount: t.amount0,
      },
      token1: {
        id: t.pool.token1.id,
        name: t.pool.token1.name,
        symbol: t.pool.token1.symbol,
        amount: t.amount1,
      },
      amountUSD: Number.parseFloat(t.amountUSD),
    })
  }
  for (const t of data?.mints ?? []) {
    unfilteredTransaction.push({
      type: V3PoolTransactionType.MINT,
      hash: t.transaction.id,
      timestamp: t.timestamp,
      sender: t.sender,
      owner: t.owner,
      token0: {
        id: t.pool.token0.id,
        name: t.pool.token0.name,
        symbol: t.pool.token0.symbol,
        amount: t.amount0,
      },
      token1: {
        id: t.pool.token1.id,
        name: t.pool.token1.name,
        symbol: t.pool.token1.symbol,
        amount: t.amount1,
      },
      amountUSD: Number.parseFloat(t.amountUSD),
    })
  }
  for (const t of data?.burns ?? []) {
    unfilteredTransaction.push({
      type: V3PoolTransactionType.BURN,
      hash: t.transaction.id,
      timestamp: t.timestamp,
      owner: t.owner,
      token0: {
        id: t.pool.token0.id,
        name: t.pool.token0.name,
        symbol: t.pool.token0.symbol,
        amount: t.amount0,
      },
      token1: {
        id: t.pool.token1.id,
        name: t.pool.token1.name,
        symbol: t.pool.token1.symbol,
        amount: t.amount1,
      },
      amountUSD: Number.parseFloat(t.amountUSD),
    })
  }

  const filteredTransactions = unfilteredTransaction?.filter((tx): tx is TableTransaction => tx.type && filter.includes(tx.type)) ?? []

  return useMemo(() => ({ data: filteredTransactions, loading, error }), [filteredTransactions, loading, error])
}
