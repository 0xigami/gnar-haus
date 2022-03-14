import styled from "@emotion/styled";
import { useEthers } from '@usedapp/core';
import WalletConnectModal from '../components/WalletConnectModal';
import React from "react";
import {
  AuctionManager,
  useManageAuction,
} from "@zoralabs/manage-auction-hooks";
import {
  NFTDataContext,
  NFTPreview,
  PreviewComponents,
} from "@zoralabs/nft-components";
import { FetchStaticData } from "@zoralabs/nft-hooks";
import { Fragment, useContext } from "react";
import useSWR from "swr";
import Head from "../components/head";
import { PageWrapper } from "./../styles/components";
import { NavLink } from '../components/NavLink'
import { css } from '@emotion/react'
import PureModal from 'react-pure-modal';
import Notify from 'simple-notify'
import 'simple-notify/dist/simple-notify.min.css'
import 'react-pure-modal/dist/react-pure-modal.min.css';

function pushNotify() {
  new Notify({
    status: 'error',
    title: 'Wallet Net',
    text: 'Please change to MainNet',
    effect: 'fade',
    speed: 300,
    showIcon: true,
    showCloseButton: true,
    autoclose: true,
    autotimeout: 3000,
    gap: 20,
    distance: 20,
    type: 1,
    position: 'right top'
  })
}

const ListItemComponent = () => {
  const {
    nft: { data },
  } = useContext(NFTDataContext);

  const { chainId, account } = useEthers();

  const { openManageAuction, openListAuction } = useManageAuction();

  if (!data || !data.nft) {
    return <Fragment />;
  }

  if (
    data.pricing.reserve?.status === "Active" ||
    data.pricing.reserve?.status === "Pending"
  ) {
    return (
      <button
        className="button"
        onClick={() => {
          const reserveId = data.pricing.reserve?.id;
          if (reserveId && chainId == 1) {
            openManageAuction(parseInt(reserveId, 10));
          }
        }}
      >
        Manage
      </button>
    );
  }

  return (
    
    <button
      onClick={() => {
        if(chainId === 1 && account)
          openListAuction(data.nft.contract.address, data.nft.tokenId);
        else
          pushNotify();
      }}
      className="button"
    >
      List
    </button>
     
  );
}; 

const RenderOwnedList = ({ account }: { account: string }) => {
  const { data, error } = useSWR(
    `/api/ownedItems?owner=${account}`,
    (url: string) => fetch(url).then((res) => res.json())
  );

  if (!data) {
    // loading
    return <Fragment />;
  }
  if (error) {
    // error
    return <Fragment />;
  }

  if (data.tokens.length === 0) {
    return (
      <div className="owned-list-no-tokens py-special">
        <h2>We couldn’t find any NFTs you own 😢</h2>
        <p>Make sure you’ve connected the correct wallet</p>
      </div>
    );
  }

  return data.tokens.map((token: any) => {
    const tokenInfo = FetchStaticData.getIndexerServerTokenInfo(token);
    return (
      <NFTPreview
        id={tokenInfo.tokenId}
        contract={tokenInfo.tokenContract}
        initialData={token}
        useBetaIndexer={true}
        key={`${tokenInfo.tokenContract}-${tokenInfo.tokenId}`}
      >
        <div className="owned-list-item">
          <PreviewComponents.MediaThumbnail />
          <div className="list-component-wrapper" css={{background: "white"}}>
            <ListItemComponent />
          </div>
        </div>
      </NFTPreview>
    );
  });
};

const MediaThumbnailPreview = ({
  tokenContract,
  tokenId,
}: {
  tokenContract: string;
  tokenId: string;
}) => {
  return (
    // TODO(iain): Fix indexer in this use case
    <NFTPreview
      id={tokenId}
      contract={tokenContract}
      useBetaIndexer={true}
    >
      <div className="owned-list-item">
        <PreviewComponents.MediaThumbnail />
        <div className="list-component-wrapper">
          <ListItemComponent />
        </div>
      </div>
    </NFTPreview>
  );
};

export default function List() {
  const { deactivate, account, chainId } = useEthers();
  const [modal, setModal] = React.useState(false);

  return (
    <>
      <style jsx global>{`
        ${chainId !== 1 && "div>"}.zora-wallet-dialogOverlay {
          display: none !important
        }
      `}</style>
      <Head title="List" />
      <AuctionManager
        renderMedia={MediaThumbnailPreview}
        strings={{
          LIST_MEDIA_HEADER: "List your NFT",
          LIST_MEDIA_DESCRIPTION: `Set the reserve price to list your NFT on ${process.env.NEXT_PUBLIC_APP_TITLE}`,
        }}
      >
      {
        !account &&
        <PureModal
          header={<div>Connect Your Wallet</div>}
          css={{
            minWidth: "250px"
          }}
          width="35%"
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
      <div className="list-header" css={{padding: '20px', display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
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
              <h2
                css={css`
                border: none;
                cursor: pointer;
              `}>Disconect Wallet</h2>
            </button>
          </div>
            :
            <div>
            <button 
              css={css`
                border: none;
                cursor: pointer;
              `}
              onClick={() => setModal(true)}>
              <h2>Connect Wallet</h2>
            </button>
          </div>
      }
     </div>
        <ListWrapper>
          <div>
            <h1>{`${
              !account
                ? "To List your NFT Connect your wallet!"
                : `Connected to ${ account && [account.substr(0, 4), account.substr(38, 4)].join('...')}`
            }`}</h1>
            <button className="button" onClick={() => { 
                !account ? setModal(true) : deactivate()
              }}>
              {
                account ? "Disconnect Wallet" : "Connect Wallet"
              }
            </button>
          </div>
          {account ?
            <div className="owned-list">
              <RenderOwnedList account={account} />
            </div>
            :
            <div className="py-special2"></div>
          }
        </ListWrapper>
      </AuctionManager>
    </>
  );
}

const ListWrapper = styled(PageWrapper)`
  max-width: var(--content-width-lg);
  .owned-list {
    padding-top: var(--space-md);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .owned-list-no-tokens {
    text-align: center;
    padding-top: var(--space-sm);
  }
  .py-special { 
    padding-top: 60px;
    padding-bottom: 150px;
  }
  .py-special2 { 
    padding-top: 60px;
    padding-bottom: 280px;
  }
  .list-component-wrapper {
    padding: var(--base-unit) 0;
    border-top: var(--border-light);
  }
  .thumbnail-manage-button {
    margin: 0 auto var(--space-sm)!important;
  }
`;
