import { Trans } from '@lingui/macro'
import styled from 'styled-components'
import { ExternalLink, ThemedText } from 'theme/components'

const StyledLink = styled(ExternalLink)`
  font-weight: 535;
  color: ${({ theme }) => theme.neutral2};
`

export default function PrivacyPolicyNotice() {
  return (
    <ThemedText.BodySmall color="neutral2">
      <Trans>By connecting a wallet, you agree to Jaguarswap&apos;s</Trans>{' '}
      <StyledLink href="https://jaguar-swap.gitbook.io/jaguar-swap-docs/terms-of-use">
        <Trans>Terms of Service</Trans>{' '}
      </StyledLink>
      <Trans>and consent to its</Trans>{' '}
      <StyledLink href="https://jaguar-swap.gitbook.io/jaguar-swap-docs/privacy-policy">
        <Trans>Privacy Policy.</Trans>
      </StyledLink>
    </ThemedText.BodySmall>
  )
}
