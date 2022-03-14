import { NFTFullPage } from "../../../components/@zora/nft-full";
import {  MediaConfiguration } from "../../../components/@zora/context/MediaConfiguration";
import { useRouter } from "next/router";
import {
  MediaFetchAgent,
  NetworkIDs,
  FetchStaticData,
} from "@zoralabs/nft-hooks";
import { GetServerSideProps } from "next";
import { NETWORK_ID, APP_TITLE } from './../../../utils/env-vars'
import { PageWrapper } from "../../../styles/components";
import Head from "../../../components/head";
import { NavLink } from './../../../components/NavLink'
import React from "react";
import { css } from '@emotion/react'
import PureModal from 'react-pure-modal';
import WalletConnectModal from '../../../components/WalletConnectModal';
import 'react-pure-modal/dist/react-pure-modal.min.css';
import { useEthers } from '@usedapp/core';
import { useMediaContext } from "../../../components/@zora/context/useMediaContext";

const styles = {
  theme: {
    lineSpacing: 24,
    linkColor: "var(--black)",
  },
};

type PieceProps = {
  name: string;
  description: string;
  image: string;
  initialData: any;
};

export default function Piece({
  name,
  description,
  image,
  initialData,
}: PieceProps) {
  const { query } = useRouter();
  const [modal, setModal] = React.useState(false);
  const { deactivate, account } = useEthers();
  const { getStyles } = useMediaContext();

  return (
    <>
      {
        !account &&
        <PureModal
          header={<div>Connect Your Wallet</div>}
          width="35%"
          css={{
            minWidth: "250px"
          }}
          isOpen={modal}
          closeButton="X"
          closeButtonPosition="header"
          onClose={() => {
            setModal(false);
            return true;
          }}
        >
          <WalletConnectModal onDismiss={() => {}}/>
        </PureModal>
      }
      <Head
        title={`${name} | ${APP_TITLE}`}
        description={description}
        ogImage={image}
      />
      <MediaConfiguration
        networkId={NETWORK_ID as NetworkIDs}
        style={styles}
      >
      <div {...getStyles("pageHeader")} css={{ padding: '20px', display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
      <NavLink passHref href="/">
        <h2
        css={css`
        border: none;
        cursor: pointer;
      `}>Home</h2>
      </NavLink>
        {
          account ?
            <div>
              <button 
                css={css`
                  border: none;
                  cursor: pointer;
                `}
                onClick={async () => {
                  await deactivate();
                  setModal(false);
                }}>
                <h2>Disconect Wallet</h2>
              </button>
            </div>
            :
            <div>
              <button 
                css={css`
                  border: none;
                  cursor: pointer;
                `}
                onClick={() =>setModal(true)}>
                <h2>Connect Wallet</h2>
              </button>
            </div>
        }
      </div>
        <PageWrapper>
          <NFTFullPage
            useBetaIndexer={true}
            contract={query.contract as string}
            id={query.id as string}
            initialData={initialData}
          />
        </PageWrapper>
      </MediaConfiguration>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params?.id || Array.isArray(params.id)) {
    return { notFound: true };
  }
  if (!params?.contract || Array.isArray(params.contract)) {
    return { notFound: true };
  }

  const id = params.id as string;
  const contract = params.contract as string;

  const fetchAgent = new MediaFetchAgent(
    NETWORK_ID as NetworkIDs
  );
  const data = await FetchStaticData.fetchZoraIndexerItem(fetchAgent, {
    tokenId: id,
    collectionAddress: contract,
  });

  const tokenInfo = FetchStaticData.getIndexerServerTokenInfo(data);

  return {
    props: {
      id,
      name: tokenInfo.metadata?.name || null,
      description: tokenInfo.metadata?.description || null,
      image: tokenInfo.image || null,
      initialData: data,
    },
  };
};