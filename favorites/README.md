# Favorites Program

This is my first Solana program deployed on the blockchain! 🚀 This project is built using [Anchor](https://www.anchor-lang.com/), a framework for Solana smart contract development.

## 📋 Description

The **Favorites Program** allows users to set and store their favorite number, color, and hobbies on the Solana blockchain. Each user's favorites are stored in a unique account derived from their public key.

## 🚀 Deployment

The program is deployed at:

```
Program ID: 7netPfPcQHpzZUt15x8LSSrWWDuSQjDhXmqrVwb1U9Dp
```
You can view transactions and logs on [Solana Explorer](https://explorer.solana.com/address/7netPfPcQHpzZUt15x8LSSrWWDuSQjDhXmqrVwb1U9Dp?cluster=devnet).

## 📦 Program Structure

### 1. **Program Logic** (`favorites.rs`)
- **`set_favorites` Function**: Stores the user's favorite number, color, and hobbies on-chain.
- **Logging**: Uses `msg!` macro to log key information for debugging.

### 2. **Account Structure**
- **`Favorites` Account:** Stores:
  - `number`: A 64-bit unsigned integer
  - `color`: A string with a max length of 50 characters
  - `hobbies`: A vector of up to 5 hobbies, each with a max length of 50 characters

### 3. **Account Context**
- **`SetFavorites` Struct:** Defines accounts required to set favorites:
  - `user`: The signer of the transaction
  - `favorites`: The PDA account to store data
  - `system_program`: Solana's system program

## 🔐 PDA (Program Derived Address)

The program uses PDAs to uniquely associate favorite data with each user:

```rust
seeds = [b"favorites", user.key().as_ref()]
```