import { style } from '@vanilla-extract/css'

import { subhead } from '../../nft/css/common.css'
import { sprinkles, vars } from '../../nft/css/sprinkles.css'

export const logoContainer = style([
  sprinkles({
    display: 'flex',
    marginRight: '12',
    alignItems: 'center',
    cursor: 'pointer',
  }),
])

export const logo = style([
  sprinkles({
    display: 'block',
    color: 'accent1',
  }),
])

export const title = style([
  sprinkles({
    display: 'block',
    color: 'neutral1',
    paddingLeft: '12',
    fontSize: '16',
    cursor: 'auto'
  }),
])

export const baseSideContainer = style([
  sprinkles({
    display: 'flex',
    width: 'full',
    flex: '1',
    flexShrink: '2',
  }),
])

export const leftSideContainer = style([
  baseSideContainer,
  sprinkles({
    alignItems: 'center',
    justifyContent: 'flex-start',
  }),
])

export const searchContainer = style([
  sprinkles({
    flex: '1',
    flexShrink: '1',
    justifyContent: { lg: 'flex-end', xl: 'center' },
    display: { sm: 'none' },
    alignSelf: 'center',

    alignItems: 'flex-start',
  }),
  { height: '42px' },
])

export const rightSideContainer = style([
  baseSideContainer,
  sprinkles({
    alignItems: 'center',
    justifyContent: 'flex-end',
  }),
])

const baseMenuItem = style([
  subhead,
  sprinkles({
    paddingY: '8',
    paddingX: { sm: '6', md: '14' },
    marginY: '4',
    borderRadius: '14',
    marginX: { sm: '4', md: '0' },
    transition: '250',
    height: 'min',
    width: 'full',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4',
  }),
  {
    lineHeight: '22px',
    textDecoration: 'none',
    ':hover': {
      background: vars.color.lightGrayOverlay,
    },
  },
])

export const menuItem = style([
  baseMenuItem,
  sprinkles({
    color: 'neutral2',
  }),
])

export const activeMenuItem = style([
  baseMenuItem,
  sprinkles({
    color: 'neutral1',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
  }),
  {
    borderImage: 'linear-gradient(90deg, #F2994A 0%, #F2C94C 100%)',
    borderImageSlice: 1,
    width: '100%'
  }
])
