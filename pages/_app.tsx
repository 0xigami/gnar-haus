import '../styles/reset.css'
import 'bootstrap/dist/css/bootstrap.css'

import type { AppProps } from 'next/app'
import { css } from '@emotion/css'

import { NetworkIDs } from '@zoralabs/nft-hooks'
import { MediaConfiguration } from '@zoralabs/nft-components'
import { Web3ConfigProvider } from '@zoralabs/simple-wallet-provider'

import { mediaConfigurationStyles } from '../styles/theme'
import GlobalStyles from '../styles/GlobalStyles'
import { DAppProvider } from '@usedapp/core'
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Footer } from '../components/Footer'

export default function CreateAuctionHouseApp({
  Component,
  pageProps
}: AppProps) {
  return (
    <>
    <Web3ReactProvider
        getLibrary={
          provider => new Web3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js
        }
      >  
      <DAppProvider config={{}}>
        <GlobalStyles />
        <Web3ConfigProvider
          networkId={parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string, 10)}
          rpcUrl={process.env.NEXT_PUBLIC_RPC_URL as string || undefined}
          theme={{
            walletOption: css`
              color: #000 !important;
              position: relative;
              width: 100%;
              padding: 20px;
              margin-bottom: 20px;
              cursor: pointer;
              &:last-child {
                margin-bottom: 0;
              }
            `,
          }}
        >
          <MediaConfiguration
            networkId={process.env.NEXT_PUBLIC_NETWORK as NetworkIDs}
            style={mediaConfigurationStyles}
          >
            <main>
              <Component {...pageProps} />
            </main>
            <Footer />
          </MediaConfiguration>
        </Web3ConfigProvider>
      </DAppProvider>
      </Web3ReactProvider>
    </>
  );
}
