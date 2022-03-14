import { css } from '@emotion/react'
import { NavLink } from './NavLink'
import {
  useWalletButton,
  useWeb3Wallet,
} from "@zoralabs/simple-wallet-provider";
import { useRouter } from 'next/router';
import { useMediaContext } from "./@zora/context/useMediaContext";

export const Header = () => {
  const { asPath, pathname } = useRouter();
  const { buttonAction, actionText, connectedInfo, active  } = useWalletButton();
  const { getStyles } = useMediaContext();

  if(asPath === "/teken/"){
    return (
      <>
        <header {...getStyles("pageHeader")} css={css`
          height: var(--header-height);
          top: 0;
          z-index: var(--header-z);
          background-color: #feefd5;
          display: flex;
          flexDirection: row;
          width: 100vw;
          align-items: center;
          justify-content: space-between;
        `}>
          <NavLink passHref href="/">
            <a>Home</a>
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
          
        </header>
      </>)
  }else{
    return (
      <>
        <header {...getStyles("pageHeader")} css={css`
          height: var(--header-height);
          top: 0;
          z-index: var(--header-z);
          background-color: #feefd5;
          display: flex;
          flexDirection: row;
          width: 100vw;
          align-items: center;
          justify-content: space-between;
        `}>
          <NavLink passHref href="/list">
            <a>List</a>
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
          
        </header>
      </>)
  }
}
