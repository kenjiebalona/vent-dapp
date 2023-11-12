import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";
import dynamic from 'next/dynamic';

const WalletConnectProvider = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => {
    if(network === WalletAdapterNetwork.Devnet) {
      return 'https://rough-fragrant-sky.solana-devnet.quiknode.pro/477388067370e0e6e2d805187ab22833700bfc62/';
    }
    return clusterApiUrl(network);
  }, [network]);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);

  return  (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default dynamic(() => Promise.resolve(WalletConnectProvider), {ssr: false});