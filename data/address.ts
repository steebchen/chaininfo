import { cache } from 'react'
import { EvmChain } from '@moralisweb3/common-evm-utils'
import Moralis from 'moralis'
import { notFound } from 'next/navigation'

export const revalidate = 3600 // 1 hour

export const getAddressData = cache(async (address: string) => {
  if (!address || !/(0x[a-fA-F0-9]{40})/.test(address)) {
    console.log('not found')
    return notFound()
  }

  console.log('getting address data', address)

  const chain = EvmChain.ETHEREUM

  const tokens = await Moralis.EvmApi.token.getWalletTokenBalances({
    address,
    chain,
  })

  const nativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
    address,
    chain,
  })

  return {
    tokens: tokens.result,
    nativeBalance: nativeBalance.result,
  }
})
