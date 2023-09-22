import { GetStaticPaths, GetStaticProps } from 'next'
import Moralis from 'moralis'
import '@/modules/moralis'
import {
  EvmChain,
  GetNativeBalanceJSONResponse,
  GetWalletTokenBalancesJSONResponse,
} from '@moralisweb3/common-evm-utils'
import { formatNumber } from '@/modules/format'
import Image from 'next/image'

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

const address = '0xE41bF9e9318C16addf7030b4ec8eC5f16c4ED2C2'

interface Params {
  tokens: GetWalletTokenBalancesJSONResponse
  nativeBalance: GetNativeBalanceJSONResponse
}

export const getStaticProps: GetStaticProps<Params> = async ({ params }) => {
  const address = params?.id
  if (!address || typeof address !== 'string') {
    return {
      notFound: true,
    }
  }

  console.log('address', address)

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
    props: {
      tokens: tokens.toJSON().sort((a, b) => {
        if (a.possible_spam && !b.possible_spam) {
          return 1
        }
        if (!a.possible_spam && b.possible_spam) {
          return -1
        }
        return 0
      }),
      nativeBalance: nativeBalance.toJSON(),
    },
    revalidate: 60,
  }
}

function HomePage({ tokens, nativeBalance }: Params) {
  const hideSpam = true
  const showPrecise = true

  return (
    <main className="p-5">
      <h1>Wallet: {address}</h1>
      <h2>Native
        Balance:
        <span>
          {formatNumber(parseFloat(nativeBalance.balance) / 10 ** 18, showPrecise ? 18 : undefined)}
        </span>
        ETH
      </h2>

      {tokens.length === 0 && (
        <p className="text-gray-300">No tokens found</p>
      )}
      <ul>
        {tokens.filter((i) => hideSpam ? !i.possible_spam : true).map((token) => (
          <li key={token.token_address}
              className={`flex items-center gap-2 ${token.possible_spam ? 'opacity-30' : ''}`}>
            {token.name} ({token.symbol}): {formatNumber(parseFloat(token.balance) / 10 ** token.decimals, showPrecise ? token.decimals : undefined)}
            {token.logo && <Image src={token.logo} width={32} height={32} alt={token.name}/>}
            {!token.logo && <span className="p-4 bg-gray-300 rounded-full"/>}
          </li>
        ))}
      </ul>
    </main>
  )
}

export default HomePage
