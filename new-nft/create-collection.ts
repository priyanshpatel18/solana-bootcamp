import {
  createNft,
  fetchDigitalAsset,
  mplTokenMetadata
} from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, keypairIdentity, percentAmount } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  airdropIfRequired,
  getExplorerLink,
  getKeypairFromFile
} from "@solana-developers/helpers";
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
const user = await getKeypairFromFile();

await airdropIfRequired(
  connection,
  user.publicKey,
  1 * LAMPORTS_PER_SOL,
  0.5 * LAMPORTS_PER_SOL
);

console.log("Loaded user: ", user.publicKey.toBase58());

const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata());

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser));

console.log("Setup Umi instance for user");

const collectionMint = generateSigner(umi);

const txn = createNft(umi, {
  mint: collectionMint,
  name: "PSquare Enterprise",
  uri: "https://raw.githubusercontent.com/priyanshpatel18/solana-bootcamp/main/collection.json",
  sellerFeeBasisPoints: percentAmount(0),
  isCollection: true,
  symbol: "PSQ"
})

await txn.sendAndConfirm(umi);

const createdCollectionNft = await fetchDigitalAsset(umi, collectionMint.publicKey);
console.log(`Created Collection! Address is ${getExplorerLink("address", createdCollectionNft.mint.publicKey, "devnet")}`);
