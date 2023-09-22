import '@/modules/moralis'
import { formatNumber } from '@/modules/format'
import Image from 'next/image'
import { getAddressData } from '@/data/address'

export const revalidate = 3600 // 1 hour

export default async function HomePage({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const { tokens: balances, nativeBalance } = await getAddressData(slug)
  const hideSpam = true
  const showPrecise = true

  return (
    <main className="p-5">
      <h1>Wallet: {slug}</h1>
      <h2>Native
        Balance:
        <span>
          {formatNumber(parseFloat(nativeBalance?.balance.ether || '0'), showPrecise ? 18 : undefined)}
        </span>
        ETH
      </h2>

      {!balances?.length && (
        <p className="text-gray-300">No tokens found</p>
      )}
      <ul>
        {balances?.filter((i) => (hideSpam ? !i.token?.possibleSpam : true)).map((balance) => (
          <li key={balance.token!.contractAddress.lowercase}
              className={`flex items-center gap-2 ${balance.token!.possibleSpam ? 'opacity-30' : ''}`}>
            {balance.token!.name} ({balance.token!.symbol}): {formatNumber(parseFloat(balance.amount.toString()) / 10 ** balance.token!.decimals, showPrecise ? balance.token!.decimals : undefined)}
            {balance.token!.logo && <Image src={balance.token!.logo} width={32} height={32} alt={balance.token!.name}/>}
            {!balance.token!.logo && <span className="p-4 bg-gray-300 rounded-full"/>}
          </li>
        ))}
      </ul>
    </main>
  )
}
