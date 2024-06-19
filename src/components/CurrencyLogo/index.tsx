import { Currency, ETHER, Token } from 'goodswap-sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import MetisLogo from '../../assets/images/Metis-logo.png'
import PolygonLogo from '../../assets/images/Polygon-logo.png'
import { default as BinanceLogo, default as EthereumLogo } from '../../assets/images/ethereum-logo.png'
import { useActiveWeb3React } from '../../hooks'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'

const getTokenLogoURL = (chainId: number | undefined, address: string) => {
  if (chainId === 1285) return `https://raw.githubusercontent.com/BCharity-Net/giveswap-tokenlist/main/assets/MOONRIVER/${address}.png`
  if (chainId === 56 || chainId === 97) return `https://tokens.bscswap.com/images/${address}.png`
  if (chainId === 80002) return `https://raw.githubusercontent.com/go-protocol/GiveSwap-tokenlist/main/assets/AMOY/${address}.png`
  if (chainId === 137) return `https://raw.githubusercontent.com/go-protocol/GiveSwap-tokenlist/main/assets/POLYGON/${address}.png`
  if (chainId === 588) return `https://raw.githubusercontent.com/BCharity-Net/giveswap-tokenlist/main/assets/METISTEST/${address}.png`
  if (chainId === 1088) return `https://raw.githubusercontent.com/BCharity-Net/giveswap-tokenlist/main/assets/METIS/${address}.png`
  return ''
}

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const { chainId } = useActiveWeb3React()
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(chainId, currency.address)]
      }

      return [getTokenLogoURL(chainId, currency.address)]
    }
    return []
  }, [currency, uriLocations, chainId])
  if (currency === ETHER) {
    return (
      <StyledEthereumLogo
        src={
          chainId === 56 || chainId === 97 ? BinanceLogo 
          : chainId === 137 || chainId === 80002 ? PolygonLogo 
          : chainId === 588 || chainId === 1088 ? MetisLogo 
          : EthereumLogo
        }
        size={size}
        style={style}
      />
    )
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
