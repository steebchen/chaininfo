import Moralis from 'moralis'

if (!Moralis.Core.isStarted) {
  void Moralis.start({
    apiKey: process.env.MORALIS_API_KEY as string,
  })
}
