import { t } from '@lingui/macro'
import { useAtom } from 'jotai'
import { lazy, ReactNode, Suspense, useMemo } from 'react'
import { matchPath, Navigate, useLocation } from 'react-router-dom'
import { shouldDisableNFTRoutesAtom } from 'state/application/atoms'
import { SpinnerSVG } from 'theme/components'
import { isBrowserRouterEnabled } from 'utils/env'

import { getDefaultTokensTitle } from './getDefaultTokensTitle'
import { getExploreTitle } from './getExploreTitle'
// High-traffic pages (index and /swap) should not be lazy-loaded.
import Landing from './Landing'
import Swap from './Swap'

const NftExplore = lazy(() => import('nft/pages/explore'))
const Collection = lazy(() => import('nft/pages/collection'))
const Profile = lazy(() => import('nft/pages/profile'))
const Asset = lazy(() => import('nft/pages/asset/Asset'))
const AddLiquidityWithTokenRedirects = lazy(() => import('pages/AddLiquidity/redirects'))
const AddLiquidityV2WithTokenRedirects = lazy(() => import('pages/AddLiquidityV2/redirects'))
const RedirectExplore = lazy(() => import('pages/Explore/redirects'))
const MigrateV2 = lazy(() => import('pages/MigrateV2'))
const MigrateV2Pair = lazy(() => import('pages/MigrateV2/MigrateV2Pair'))
const NotFound = lazy(() => import('pages/NotFound'))
const Pool = lazy(() => import('pages/Pool'))
const PositionPage = lazy(() => import('pages/Pool/PositionPage'))
const PoolV2 = lazy(() => import('pages/Pool/v2'))
const PoolDetails = lazy(() => import('pages/PoolDetails'))
const PoolFinder = lazy(() => import('pages/PoolFinder'))
const RemoveLiquidity = lazy(() => import('pages/RemoveLiquidity'))
const RemoveLiquidityV3 = lazy(() => import('pages/RemoveLiquidity/V3'))
const TokenDetails = lazy(() => import('pages/TokenDetails'))

// this is the same svg defined in assets/images/blue-loader.svg
// it is defined here because the remote asset may not have had time to load when this file is executing
const LazyLoadSpinner = () => (
  <SpinnerSVG width="94" height="94" viewBox="0 0 94 94" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M92 47C92 22.1472 71.8528 2 47 2C22.1472 2 2 22.1472 2 47C2 71.8528 22.1472 92 47 92" stroke="#2172E5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </SpinnerSVG>
)

interface RouterConfig {
  browserRouterEnabled?: boolean
  hash?: string
  shouldDisableNFTRoutes?: boolean
}

/**
 * Convenience hook which organizes the router configuration into a single object.
 */
export function useRouterConfig(): RouterConfig {
  const browserRouterEnabled = isBrowserRouterEnabled()
  const { hash } = useLocation()
  const [shouldDisableNFTRoutes] = useAtom(shouldDisableNFTRoutesAtom)
  return useMemo(
    () => ({
      browserRouterEnabled,
      hash,
      shouldDisableNFTRoutes: Boolean(shouldDisableNFTRoutes),
    }),
    [browserRouterEnabled, hash, shouldDisableNFTRoutes]
  )
}

export interface RouteDefinition {
  path: string
  nestedPaths: string[]
  getTitle: (path?: string) => string
  enabled: (args: RouterConfig) => boolean
  getElement: (args: RouterConfig) => ReactNode
}

// Assigns the defaults to the route definition.
function createRouteDefinition(route: Partial<RouteDefinition>): RouteDefinition {
  return {
    getElement: () => null,
    getTitle: () => 'Jaguar Interface',
    enabled: () => true,
    path: '/',
    nestedPaths: [],
    // overwrite the defaults
    ...route,
  }
}

const SwapTitle = t`Buy, sell & trade Ethereum and other top tokens on Jaguarswap`

export const routes: RouteDefinition[] = [
  createRouteDefinition({
    path: '/',
    getTitle: () => t`Jaguarswap | Trade crypto safely on the top DeFi exchange`,
    getElement: () => <Swap />,
  }),
  createRouteDefinition({
    path: '/explore',
    getTitle: getExploreTitle,
    nestedPaths: [':tab', ':chainName', ':tab/:chainName'],
    getElement: () => <RedirectExplore />,
  }),
  createRouteDefinition({
    path: '/explore/tokens/:chainName/:tokenAddress',
    getTitle: () => t`Buy & sell on Jaguarswap`,
    getElement: () => <TokenDetails />,
  }),
  createRouteDefinition({
    path: '/tokens',
    getTitle: getDefaultTokensTitle,
    getElement: () => <Navigate to="/explore/tokens" replace />,
  }),
  createRouteDefinition({
    path: '/tokens/:chainName',
    getTitle: getDefaultTokensTitle,
    getElement: () => <RedirectExplore />,
  }),
  createRouteDefinition({
    path: '/tokens/:chainName/:tokenAddress',
    getTitle: getDefaultTokensTitle,
    getElement: () => <RedirectExplore />,
  }),
  createRouteDefinition({
    path: '/explore/pools/:chainName/:poolAddress',
    getTitle: () => t`Explore pools on Jaguarswap`,
    getElement: () => (
      <Suspense fallback={null}>
        <PoolDetails />
      </Suspense>
    ),
  }),
  createRouteDefinition({
    path: '/send',
    getElement: () => <Swap />,
    getTitle: () => t`Send tokens on Jaguarswap`,
  }),
  createRouteDefinition({
    path: '/limits',
    getElement: () => <Navigate to="/limit" replace />,
  }),
  createRouteDefinition({
    path: '/limit',
    getElement: () => <Swap />,
    getTitle: () => SwapTitle,
  }),
  createRouteDefinition({
    path: '/swap',
    getElement: () => <Swap />,
    getTitle: () => SwapTitle,
  }),
  createRouteDefinition({
    path: '/pool/v2/find',
    getElement: () => <PoolFinder />,
    getTitle: () => t`Explore top liquidity pools on Jaguarswap`,
  }),
  createRouteDefinition({
    path: '/pool/v2',
    getElement: () => <PoolV2 />,
    getTitle: () => t`Provide liquidity to pools on Jaguarswap`,
  }),
  createRouteDefinition({
    path: '/pool',
    getElement: () => <Pool />,
    getTitle: () => t`Manage & provide pool liquidity on Jaguarswap`,
  }),
  createRouteDefinition({
    path: '/pool/:tokenId',
    getElement: () => <PositionPage />,
    getTitle: () => t`Manage pool liquidity on Jaguarswap`,
  }),
  createRouteDefinition({
    path: '/pools/v2/find',
    getElement: () => <PoolFinder />,
    getTitle: () => t`Explore top liquidity pools (v2) on Jaguarswap`,
  }),
  createRouteDefinition({
    path: '/pools/v2',
    getElement: () => <PoolV2 />,
    getTitle: () => t`Manage & provide v2 pool liquidity on Jaguarswap`,
  }),
  createRouteDefinition({
    path: '/pools',
    getElement: () => <Pool />,
    getTitle: () => t`Manage & provide pool liquidity on Jaguarswap`,
  }),
  createRouteDefinition({
    path: '/pools/:tokenId',
    getElement: () => <PositionPage />,
    getTitle: () => t`Manage pool liquidity on Jaguarswap`,
  }),
  createRouteDefinition({
    path: '/add/v2',
    nestedPaths: [':currencyIdA', ':currencyIdA/:currencyIdB'],
    getElement: () => <AddLiquidityV2WithTokenRedirects />,
    getTitle: () => t`Provide liquidity to pools (v2) on Jaguarswap`,
  }),
  createRouteDefinition({
    path: '/add',
    nestedPaths: [':currencyIdA', ':currencyIdA/:currencyIdB', ':currencyIdA/:currencyIdB/:feeAmount', ':currencyIdA/:currencyIdB/:feeAmount/:tokenId'],
    getElement: () => <AddLiquidityWithTokenRedirects />,
    getTitle: () => t`Provide liquidity to pools on Jaguarswap`,
  }),
  createRouteDefinition({
    path: '/remove/v2/:currencyIdA/:currencyIdB',
    getElement: () => <RemoveLiquidity />,
    getTitle: () => t`Manage v2 pool liquidity on Jaguarswap`,
  }),
  createRouteDefinition({
    path: '/remove/:tokenId',
    getElement: () => <RemoveLiquidityV3 />,
    getTitle: () => t`Manage pool liquidity on Jaguarswap`,
  }),
  createRouteDefinition({
    path: '/migrate/v2',
    getElement: () => <MigrateV2 />,
    getTitle: () => t`Migrate v2 pool liquidity to Jaguarswap v3`,
  }),
  createRouteDefinition({
    path: '/migrate/v2/:address',
    getElement: () => <MigrateV2Pair />,
    getTitle: () => t`Migrate v2 pool liquidity to Jaguarswap v3`,
  }),
  createRouteDefinition({
    path: '/nfts',
    getElement: () => (
      <Suspense fallback={null}>
        <NftExplore />
      </Suspense>
    ),
    enabled: (args) => !args.shouldDisableNFTRoutes,
    getTitle: () => t`Trade NFTs across OpenSea & other top marketplaces on Jaguarswap`,
  }),
  createRouteDefinition({
    path: '/nfts/asset/:contractAddress/:tokenId',
    getElement: () => (
      <Suspense fallback={null}>
        <Asset />
      </Suspense>
    ),
    enabled: (args) => !args.shouldDisableNFTRoutes,
    getTitle: () => t`Explore NFTs on Jaguarswap`,
  }),
  createRouteDefinition({
    path: '/nfts/profile',
    getElement: () => (
      <Suspense fallback={null}>
        <Profile />
      </Suspense>
    ),
    enabled: (args) => !args.shouldDisableNFTRoutes,
    getTitle: () => t`Explore NFTs on Jaguarswap`,
  }),
  createRouteDefinition({
    path: '/nfts/collection/:contractAddress',
    getElement: () => (
      <Suspense fallback={null}>
        <Collection />
      </Suspense>
    ),
    enabled: (args) => !args.shouldDisableNFTRoutes,
    getTitle: () => t`Explore NFTs on Jaguarswap`,
  }),
  createRouteDefinition({
    path: '/nfts/collection/:contractAddress/activity',
    getElement: () => (
      <Suspense fallback={null}>
        <Collection />
      </Suspense>
    ),
    enabled: (args) => !args.shouldDisableNFTRoutes,
    getTitle: () => t`Explore NFTs on Jaguarswap`,
  }),
  createRouteDefinition({ path: '*', getElement: () => <Navigate to="/not-found" replace /> }),
  createRouteDefinition({ path: '/not-found', getElement: () => <NotFound /> }),
]

export const findRouteByPath = (pathname: string) => {
  for (const route of routes) {
    const match = matchPath(route.path, pathname)
    if (match) {
      return route
    }
    const subPaths = route.nestedPaths.map((nestedPath) => `${route.path}/${nestedPath}`)
    for (const subPath of subPaths) {
      const match = matchPath(subPath, pathname)
      if (match) {
        return route
      }
    }
  }
  return undefined
}
