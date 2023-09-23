import '@/modules/moralis'
import { formatNumber } from '@/modules/format'
import Image from 'next/image'
import { getAddressDataCache } from '@/data/address-cache'

export const revalidate = 3600 // 1 hour

export default async function HomePage({
  params: { slug },
}: {
  params: { slug: string }
}) {
  console.log('render address page')

  // for testing, you can switch out getAddressDataCache with getAddressData
  // getAddressDataCache uses `cache` from react with `revalidate`, which does not seem to work
  // getAddressDataUnstable uses unstable_cache from next, which does work
  const { tokens: balances, nativeBalance } = await getAddressDataCache(slug)
  const hideSpam = true
  const showPrecise = false

  return (
    <main className="p-5">
      <h1>Wallet: {slug}</h1>
      <h2>Native
        Balance:
        <span>
          {formatNumber(parseFloat(nativeBalance?.balance || '0') / 10 ** 18, showPrecise ? 18 : undefined)}
        </span>
        ETH
      </h2>

      {!balances?.length && (
        <p className="text-gray-300">No tokens found</p>
      )}
      <ul>
        {balances?.filter((i) => (hideSpam ? !i.possible_spam : true)).map((item) => (
          <li key={`${item.token_address}${item.symbol}`}
              className={`flex items-center gap-2 ${item.possible_spam ? 'opacity-30' : ''}`}>
            {item.name} ({item.symbol}): {formatNumber(parseFloat(item.balance + '') / 10 ** item.decimals, showPrecise ? item.decimals : undefined)}
            {item.logo && <Image src={item.logo} width={32} height={32} alt={item.name}/>}
            {!item.logo && <span className="p-4 bg-gray-300 rounded-full"/>}
          </li>
        ))}
      </ul>
    </main>
  )
}
