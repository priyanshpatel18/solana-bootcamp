'use client'

import { PublicKey } from '@solana/web3.js'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useJournalProgram, useJournalProgramAccount } from './crudapp-data-access'
import { useWallet } from '@solana/wallet-adapter-react'
import toast from 'react-hot-toast'

export function EntryCreate() {
  const { createEntry } = useJournalProgram();
  const [title, setTitle] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const { publicKey } = useWallet();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    if (!publicKey) {
      return toast.error('Wallet not connected');
    }

    if (!title.trim() || !message.trim()) {
      return toast.error('Title and message are required');
    }

    createEntry.mutateAsync({ title, message })
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col items-center max-w-5xl'>
      <Input placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Input placeholder="Enter message" value={message} onChange={(e) => setMessage(e.target.value)} />

      <Button type='submit' disabled={title.trim() === '' || message.trim() === ''}>
        <span>Create</span>
      </Button>
    </form>
  )
}

export function Journal() {
  const { accounts, getProgramAccount } = useJournalProgram()

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    )
  }
  return (
    <div className={'space-y-6'}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account) => (
            <JournalEntryCard key={account.publicKey.toString()} account={account.publicKey} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={'text-2xl'}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  )
}

export default function JournalEntryCard({ account }: { account: PublicKey }) {
  const { accountQuery, updateEntry, deleteEntry } = useJournalProgramAccount({ account });
  const { publicKey } = useWallet();
  const title = accountQuery.data?.title || "";
  const [message, setMessage] = useState<string>("");

  const handleUpdate = () => {
    if (!publicKey) {
      return toast.error("Wallet not connected");
    }
    if (!message.trim()) {
      return toast.error("Message is required")
    }

    updateEntry.mutateAsync({ title, message })
  };

  const handleRefresh = () => {
    accountQuery.refetch();
    console.log("Refreshed", account.toBase58());
  };

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content p-4 shadow-md bg-base-200">
      <div className="card-body items-center text-center space-y-4">
        <h2 className="card-title text-3xl cursor-pointer" onClick={handleRefresh}>
          {title}
        </h2>

        <Input
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input input-bordered w-full"
        />

        <div className="flex space-x-4">
          <button onClick={handleUpdate}>Edit</button>
          <button onClick={() => {
            if (title.trim()) {
              return toast.error("Title is missing");
            }
            deleteEntry.mutate({ title })
          }}>Delete</button>
          <button onClick={handleRefresh}>Refresh</button>
        </div>
      </div>
    </div>
  );
}
