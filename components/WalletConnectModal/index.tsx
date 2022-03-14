import WalletButton from '../WalletButton';
import { WALLET_TYPE } from '../WalletButton';
import { useEthers } from '@usedapp/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { TrezorConnector } from '@web3-react/trezor-connector';
import { FortmaticConnector } from '@web3-react/fortmatic-connector';
import config, { CHAIN_ID } from '../../config';
import { useMediaContext } from "../@zora/context/useMediaContext";

const WalletConnectModal: React.FC<{ onDismiss: () => void }> = props => {
  const { activate, account, chainId } = useEthers();
  const supportedChainIds = [CHAIN_ID];
  const { getStyles } = useMediaContext();
  
  const wallets = (
    <div>
      <div {...getStyles("pureModal")}>
        <WalletButton
          onClick={() => {
            const injected = new InjectedConnector({
              supportedChainIds,
            });
            activate(injected);
          }}
          walletType={WALLET_TYPE.metamask}
          
        />
        <WalletButton
          onClick={() => {
            const fortmatic = new FortmaticConnector({
              apiKey: 'pk_test_FB5E5C15F2EC5AE6',
              chainId: CHAIN_ID,
            });
            activate(fortmatic);
          }}
          walletType={WALLET_TYPE.fortmatic}
        />
      </div>
      <div {...getStyles("pureModal")}>
        <WalletButton
          onClick={() => {
            const walletlink = new WalletConnectConnector({
              supportedChainIds,
              chainId: CHAIN_ID,
              rpc: {
                [CHAIN_ID]: config.app.jsonRpcUri,
              },
            });
            activate(walletlink);
          }}
          walletType={WALLET_TYPE.walletconnect}
        />
        <WalletButton
          onClick={() => {
            const walletlink = new WalletLinkConnector({
              appName: 'Nouns.WTF',
              appLogoUrl: 'https://gnars.wtf/static/media/logo.cdea1650.svg',
              url: config.app.jsonRpcUri,
              supportedChainIds,
            });
            activate(walletlink);
          }}
          walletType={WALLET_TYPE.coinbaseWallet}
        />
      </div>
      <div {...getStyles("pureModal")}>
        <WalletButton
          onClick={() => {
            const injected = new InjectedConnector({
              supportedChainIds,
            });
            activate(injected);
          }}
          walletType={WALLET_TYPE.brave}
        />
        <WalletButton
          onClick={() => {
            const trezor = new TrezorConnector({
              chainId: CHAIN_ID,
              url: config.app.jsonRpcUri,
              manifestAppUrl: 'https://gnars.wtf',
              manifestEmail: 'nounops+trezorconnect@protonmail.com',
            });
            activate(trezor);
          }}
          walletType={WALLET_TYPE.trezor}
        />
      </div>
    </div>
  );
  return <div>{wallets}</div>;
};
export default WalletConnectModal;
