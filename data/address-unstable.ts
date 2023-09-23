import { EvmChain } from '@moralisweb3/common-evm-utils'
import Moralis from 'moralis'
import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import { getAddressData } from '@/data/get'

// import { cache } from 'react'
// export const revalidate = 10

export const getAddressDataUnstable = unstable_cache(async (address: string) => {
  return getAddressData(address)
}, [], { revalidate: 10 })
