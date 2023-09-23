import { cache } from 'react'
import { getAddressData } from '@/data/get'

export const revalidate = 10

export const getAddressDataCache = cache(async (address: string) => {
  return getAddressData(address)
})
