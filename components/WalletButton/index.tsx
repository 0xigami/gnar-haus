import { Button } from 'react-bootstrap';
import classes from './WalletButton.module.css';

export enum WALLET_TYPE {
  metamask = 'Metamask',
  brave = 'Brave',
  ledger = 'Ledger',
  walletconnect = 'WalletConnect',
  fortmatic = 'Fortmatic',
  trezor = 'Trezor',
  coinbaseWallet = 'Coinbase Wallet',
}

const logo = (walletType: WALLET_TYPE) => {
  switch (walletType) {
    case WALLET_TYPE.metamask:
      return `/assets/wallet-brand-assets/metamask-fox.svg`;
    case WALLET_TYPE.fortmatic:
      return `/assets/wallet-brand-assets/fortmatic.svg`;
    case WALLET_TYPE.walletconnect:
      return `/assets/wallet-brand-assets/walletconnect-logo.svg`;
    case WALLET_TYPE.brave:
      return `/assets/wallet-brand-assets/brave.svg`;
    case WALLET_TYPE.ledger:
      return `/assets/wallet-brand-assets/ledger.svg`;
    case WALLET_TYPE.trezor:
      return `/assets/wallet-brand-assets/trezor.svg`;
    case WALLET_TYPE.coinbaseWallet:
      return `/assets/wallet-brand-assets/coinbase-wallet-dot.svg`;
    default:
      return '';
  }
};

const WalletButton: React.FC<{ onClick: () => void; walletType: WALLET_TYPE }> = props => {
  const { onClick, walletType } = props;

  return (
    <Button className={classes.walletButton} onClick={onClick}>
      <img src={logo(walletType)} alt={`${walletType} logo`} width={24} height={24} />
      <span css={{fontSize: '18px', fontWeight: 100}}>{walletType}</span>
    </Button>
  );
};
export default WalletButton;
