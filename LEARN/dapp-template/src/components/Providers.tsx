"use client";

import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { ReactNode, useCallback, useMemo, useState } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <SolanaProvider>
        {children}
      </SolanaProvider>
    </ReactQueryProvider>
  )
}

function SolanaProvider({ children }: { children: ReactNode }) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [],
    [network]
  );

  const onError = useCallback((error: WalletError) => {
    console.error(error)
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(new QueryClient())

  return (
    <QueryClientProvider client={client}>
      <ReactQueryStreamedHydration>
        {children}
      </ReactQueryStreamedHydration>
    </QueryClientProvider>
  )
}