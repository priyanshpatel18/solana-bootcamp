"use client";

import { WalletButton } from "@/components/WalletButton";
import { useWallet } from "@solana/wallet-adapter-react";
import { redirect } from "next/navigation";

export default function page() {
  const { publicKey } = useWallet();

  if (publicKey) {
    return redirect(`/account/${publicKey.toString()}`)
  }

  return (
    <div className="">
      <WalletButton />
    </div>
  )
}
