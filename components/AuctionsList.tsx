import React from "react";
import ReactDOM from 'react-dom';
import { useRouter } from "next/router";
import { NavLink } from './NavLink';
import { css } from '@emotion/react';
import { useEthers } from '@usedapp/core';
import Posts from './Posts'
import ReactPaginate from 'react-paginate';
import styled from 'styled-components';
import WalletConnectModal from './WalletConnectModal';
import PureModal from 'react-pure-modal';
import { useMediaContext } from "./@zora/context/useMediaContext";
import 'react-pure-modal/dist/react-pure-modal.min.css';

const MyPaginate = styled(ReactPaginate).attrs({
  // You can redifine classes here, if you want.
  activeClassName: 'active', // default to "disabled"
})`
  overflow: visible;
  font-size: 25px;
  padding-top: 5px !important;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  list-style-type: none;
  padding: 0 5rem;
  li a {
    border-radius: 7px;
    padding: 0.1rem 0.5rem;
    border: gray 1px solid;
    cursor: pointer;
  }
  li {
    overflow-x: visible;
    overflow-y: visible;
    padding: 1px;
  }
  li.previous a,
  li.next a,
  li.break a {
    border-color: transparent;
    text-decoration: none;
  }
  li.active a {
    background-color: #0366d6;
    border-color: transparent;
    color: white !important;
  }
  li.disabled a {
    color: grey;
  }
  li.disable,
  li.disabled a {
    cursor: default;
  }
  a {
    color: black;
  }
`;

export const AuctionsList = ({ tokens }: { tokens: any[] }) => {
  const router = useRouter();
  const [ list, setList ] = React.useState<any[]>([]);
  const [ loading ,setLoading] = React.useState(true);
  const [ postsPerPage ] = React.useState(24);
  const [ currentPage, setCurrentPage ] = React.useState(1);
  const [modal, setModal] = React.useState(false);
  const { deactivate, account } = useEthers();
  const { getStyles } = useMediaContext();

  React.useEffect(() => {
    setLoading(true)
    let temp_list = tokens;
    temp_list.sort(function(a, b) {
        return  parseInt(b.nft.tokenData.tokenId) - parseInt(a.nft.tokenData.tokenId);
    });
    setList(temp_list);
    setLoading(tokens.length < 1)
    
    ReactDOM.render(
      <MyPaginate
        pageCount={list ? Math.ceil(list!.length / postsPerPage): 0}
        pageRangeDisplayed={1}
        marginPagesDisplayed={3}
        onPageChange={paginate}
        forcePage={currentPage - 1}
        nextLabel=">"
        previousLabel="<"
      />,
      document.getElementById('container')
    );
  }, [list, tokens]);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = list.slice(indexOfFirstPost, indexOfLastPost);
  
  // Change page
  const paginate = (pageNumber: {selected:number}) => 
  {
    window.scrollTo(0, 0)
    setCurrentPage(pageNumber?.selected + 1);
  }
 
  return (
    <>
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
      <div {...getStyles("pageHeader")} css={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
        <NavLink 
          css={css`
          border: none;
          cursor: pointer;
        `}
        passHref href="/list">
          <h2
            css={css`
            border: none;
            cursor: pointer;
          `}>List</h2>
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
      <div css={{ display: "flex", flexDirection:'column', flexWrap: "wrap", justifyContent: "center", alignItems:'center' }}>
        <div>
          <h1>{process.env.NEXT_PUBLIC_APP_TITLE}</h1>
        </div>
        <div>
          <p>{process.env.NEXT_PUBLIC_DEFAULT_DESCRIPTION}</p>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <Posts posts={currentPosts} loading={loading} />
      </div>
      <div id='container'></div>
    </>
  );
};