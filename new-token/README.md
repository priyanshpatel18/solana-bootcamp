# Deploying a Token on Solana Devnet Using CLI

## Prerequisites
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli) installed
- [spl-token CLI](https://spl.solana.com/token) installed

---

## 1️⃣ Generate a Mint Authority
Run the following command to generate a keypair with a specific prefix:

```bash
solana-keygen grind --starts-with boss:1
```

This will generate a keypair file in your current directory.

---

## 2️⃣ Set the Solana Cluster to Devnet
Configure your Solana CLI to use the devnet cluster:

```bash
solana config set -ud
```

---

## 3️⃣ Airdrop SOL to Your Mint Authority
Since transactions require SOL, visit [Solana Faucet](https://solfaucet.com/) and airdrop some SOL to your new wallet.

Alternatively, use the CLI:
```bash
solana airdrop 2
```

---

## 4️⃣ Generate a Mint Account
Create a keypair for the token mint account:

```bash
solana-keygen grind --starts-with mint:1
```

This will create another keypair file in the current directory.

---

## 5️⃣ Create the Token
Run the following command to create a token using your mint keypair:

```bash
spl-token create-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb --enable-metadata <MINT_ADDRESS>.json 
```

Replace `<MINT_ADDRESS>` with the actual mint address.

---

## 6️⃣ Deploy Metadata JSON
Create a `metadata.json` file and upload it to a publicly accessible place like GitHub or Arweave. The metadata file should look something like this:

```json
{
  "name": "MyToken",
  "symbol": "MTK",
  "uri": "https://raw.githubusercontent.com/your-repo/metadata.json"
}
```

---

## 7️⃣ Initialize Token Metadata
Run the following command to initialize the metadata:

```bash
spl-token initialize-metadata <MINT_ADDRESS> "MyToken" "MTK" <METADATA_URL>
```

Replace `<METADATA_URL>` with the public link to your `metadata.json`.

---

## 8️⃣ Create a PDA to Hold the Tokens
Create a token account to hold the tokens:

```bash
spl-token create-account <MINT_ADDRESS>
```

---

## 9️⃣ Mint Tokens
Mint tokens to the PDA:

```bash
spl-token mint <MINT_ADDRESS> 1000
```

This will mint 1000 tokens to your token account.

---

**Congratulations!** Your token is now deployed on Solana devnet with metadata!

You can check your token details using:
```bash
spl-token accounts