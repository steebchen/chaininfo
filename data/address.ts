import { EvmChain } from '@moralisweb3/common-evm-utils'
import Moralis from 'moralis'
import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'

export const revalidate = 10

export const getAddressData = unstable_cache(async (address: string) => {
  if (!address || !/(0x[a-fA-F0-9]{40})/.test(address)) {
    return notFound()
  }

  console.log('getAddressData', address)

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
    tokens: tokens.toJSON(),
    nativeBalance: nativeBalance.toJSON(),
  }
})
