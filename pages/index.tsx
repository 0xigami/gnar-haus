import React from 'react';
import styled from "@emotion/styled";
import Head from "../components/head";
import { PageWrapper } from "../styles/components";
import { GetStaticProps } from "next";
import { AuctionsList } from "../components/AuctionsList";
import { useEffect, useState } from 'react';

import {
  FetchStaticData,
  MediaFetchAgent,
  NetworkIDs,
} from "@zoralabs/nft-hooks";

export default function Home() {
  const [tokens, setTokens] = useState([]);
  //@ts-ignore
  useEffect(async () => {
    const fetchAgent = new MediaFetchAgent(
      process.env.NEXT_PUBLIC_NETWORK_ID as NetworkIDs
    );
    const contractAddress = process.env
      .NEXT_PUBLIC_TARGET_CONTRACT_ADDRESS as string;
    const tokens_temp: any = await FetchStaticData.fetchZoraIndexerList(fetchAgent, {
      curatorAddress: process.env.NEXT_PUBLIC_CURATORS_ID as any,
      collectionAddresses: contractAddress ? contractAddress.split(',') : undefined,
      limit: 10000,
      offset: 0,
    });
    
    setTokens(tokens_temp);
  }, [])
  return (
    <IndexWrapper>
        <Head />
        <AuctionsList tokens={tokens} />
    </IndexWrapper>
  );
}

const IndexWrapper = styled(PageWrapper)`
  font-family: 'Londrina Solid', cursive;
  max-width: var(--content-width-xl);
  background: #feefd5;  
`;
