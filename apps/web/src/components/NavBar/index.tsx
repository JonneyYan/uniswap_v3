import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { UniIcon } from 'components/Logo/UniIcon'
import Web3Status from 'components/Web3Status'
import { chainIdToBackendName } from 'graphql/data/util'
import { useDisableNFTRoutes } from 'hooks/useDisableNFTRoutes'
import { useIsLandingPage } from 'hooks/useIsLandingPage'
import { useIsNftPage } from 'hooks/useIsNftPage'
import { useIsPoolsPage } from 'hooks/useIsPoolsPage'
import { Box } from 'nft/components/Box'
import { Row } from 'nft/components/Flex'
import { useProfilePageState } from 'nft/hooks'
import { ProfilePageStateType } from 'nft/types'
import { GetTheAppButton } from 'pages/Landing/components/DownloadApp/GetTheAppButton'
import { ReactNode, useCallback } from 'react'
import { NavLink, NavLinkProps, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { useAccountDrawer } from 'components/AccountDrawer/MiniPortfolio/hooks'
import { Z_INDEX } from 'theme/zIndex'
import { Chain } from 'uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'
import { useIsNavSearchInputVisible } from '../../nft/hooks/useIsNavSearchInputVisible'
import { Bag } from './Bag'
import Blur from './Blur'
import { ChainSelector } from './ChainSelector'
import { More } from './More'
import { SearchBar } from './SearchBar'
import * as styles from './style.css'

const Nav = styled.nav`
  padding: ${({ theme }) => `${theme.navVerticalPad}px 12px`};
  width: 100%;
  height: ${({ theme }) => theme.navHeight}px;
  z-index: ${Z_INDEX.sticky};
`

interface MenuItemProps {
  href: string
  id?: NavLinkProps['id']
  isActive?: boolean
  children: ReactNode
  dataTestId?: string
}

const MenuItem = ({ href, dataTestId, id, isActive, children }: MenuItemProps) => {
  return (
    <NavLink to={href} className={isActive ? styles.activeMenuItem : styles.menuItem} id={id} style={{ textDecoration: 'none' }} data-testid={dataTestId}>
      {children}
    </NavLink>
  )
}

export const PageTabs = () => {
  const { pathname } = useLocation()
  const { chainId: connectedChainId } = useWeb3React()
  const chainName = chainIdToBackendName(connectedChainId)

  const isPoolActive = useIsPoolsPage()
  const isNftPage = useIsNftPage()

  const shouldDisableNFTRoutes = useDisableNFTRoutes()

  return (
    <>
      <MenuItem href="/swap" isActive={pathname.startsWith('/swap')}>
        <Trans>Trade</Trans>
      </MenuItem>
      <MenuItem href={'/explore'} isActive={pathname.startsWith('/explore')}>
        <Trans>Explore</Trans>
      </MenuItem>{' '}
      <MenuItem href="/pool" dataTestId="pool-nav-link" isActive={isPoolActive}>
        <Trans>Pool</Trans>
      </MenuItem>
      {/* {!shouldDisableNFTRoutes && (
        <MenuItem dataTestId="nft-nav" href="/nfts" isActive={isNftPage}>
          <Trans>NFTs</Trans>
        </MenuItem>
      )} */}
      {/* <Box display={{ sm: "flex", lg: "none", xxl: "flex" }} width="full">
        <MenuItem
          href="/pool"
          dataTestId="pool-nav-link"
          isActive={isPoolActive}
        >
          <Trans>Pool</Trans>
        </MenuItem>
      </Box>
      <More /> */}
    </>
  )
}

const Navbar = ({ blur }: { blur: boolean }) => {
  const isNftPage = useIsNftPage()
  const isLandingPage = useIsLandingPage()
  const sellPageState = useProfilePageState((state) => state.state)
  const navigate = useNavigate()
  const isNavSearchInputVisible = useIsNavSearchInputVisible()

  const { account } = useWeb3React()
  const [accountDrawerOpen, toggleAccountDrawer] = useAccountDrawer()
  const handleUniIconClick = useCallback(() => {
    // if (account) {
    //   return
    // }
    if (accountDrawerOpen) {
      toggleAccountDrawer()
    }
    navigate({
      pathname: '/swap',
      // search: '?intro=true',
    })
  }, [account, accountDrawerOpen, navigate, toggleAccountDrawer])

  return (
    <>
      {blur && <Blur />}
      <Nav>
        <Box display="flex" height="full" flexWrap="nowrap">
          <Box className={styles.leftSideContainer}>
            <Box className={styles.logoContainer}>
              <UniIcon width="48" height="48" data-testid="uniswap-logo" className={styles.logo} clickable={!account} onClick={handleUniIconClick} />
              <Box className={styles.title}>Jaguar Swap</Box>
            </Box>
            {/* {!isNftPage && (
              <Box display={{ sm: 'flex', lg: 'none' }}>
                <ChainSelector leftAlign={true} />
              </Box>
            )} */}
          </Box>
          <Row display={{ sm: 'none', lg: 'flex' }} justifyContent={{ lg: 'flex-end', xl: 'center' }}>
            <PageTabs />
          </Row>
          {/* <Box
            className={styles.searchContainer}
            {...(isNavSearchInputVisible && {
              display: 'flex',
            })}
          >
            <SearchBar />
          </Box> */}
          <Box className={styles.rightSideContainer}>
            <Row gap="12">
              {/* <Box position="relative" display={isNavSearchInputVisible ? 'none' : { sm: 'flex' }}>
                <SearchBar />
              </Box> */}
              {isNftPage && sellPageState !== ProfilePageStateType.LISTING && <Bag />}
              {!isNftPage && (
                <Box display={{ sm: 'none', lg: 'flex' }}>
                  <ChainSelector />
                </Box>
              )}
              {/* {isLandingPage && <GetTheAppButton />} */}
              <Web3Status />
            </Row>
          </Box>
        </Box>
      </Nav>
    </>
  )
}

export default Navbar
