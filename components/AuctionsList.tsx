import React from "react";
import { useRouter } from "next/router";
import { NavLink } from './NavLink';
import { css } from '@emotion/react';
import { useWalletButton, } from "@zoralabs/simple-wallet-provider";
import { Pagination } from './Pagination'
import Posts from './Posts'

export const AuctionsList = ({ tokens }: { tokens: any[] }) => {
  const router = useRouter();
  const [ list, setList ] = React.useState<any[]>([]);
  const [ loading ,setLoading] = React.useState(true);
  const [ postsPerPage ] = React.useState(24);
  const [ currentPage, setCurrentPage ] = React.useState(1);
  const { buttonAction, actionText, connectedInfo, active  } = useWalletButton();

  React.useEffect(() => {
    setLoading(true)  
    setList(tokens);
    if(list){
      list.sort(function(a, b) {
          return  parseFloat(b.nft.tokenData.tokenId) - parseFloat(a.nft.tokenData.tokenId);
      });
      setLoading(false)
    }
  }, [list]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = list.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber: number) => 
  {
    window.scrollTo(0, 0)
    setCurrentPage(pageNumber);
  }
  

  return (
    <>
      <div css={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
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
          active ?
            <div>
              <button 
                css={css`
                  border: none;
                  cursor: pointer;
                `}
                onClick={() => buttonAction()}>
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
                onClick={() => buttonAction()}>
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
      <div>
      <Posts posts={currentPosts} loading={loading} />
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={ list ? list!.length : 0}
        paginate={paginate}/>
      </div>
    </>
  );
};