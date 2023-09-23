import { unstable_cache } from 'next/cache'
import { getAddressData } from '@/data/get'

// this works!
export const getAddressDataUnstable = unstable_cache(async (address: string) => {
  return getAddressData(address)
}, [], { revalidate: 10 })
