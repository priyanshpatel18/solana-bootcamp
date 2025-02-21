import {
  findMetadataPda,
  mplTokenMetadata,
  verifyCollectionV1
} from "@metaplex-foundation/mpl-token-metadata";
import { keypairIdentity, publicKey } from "@metaplex-foundation/umi";
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

const collectionAddress = publicKey("FVCgrq6VtASWoYAvD2bFqQPytjKswHHt7Asgw291DV8t");
const nftAddress = publicKey("HcB5Up1hRKoKaRbB6vc2Jj9cRJLd8VjLFoJRJB4JmZ6g");

await verifyCollectionV1(umi, {
  metadata: findMetadataPda(umi, { mint: nftAddress }),
  collectionMint: collectionAddress,
  authority: umi.identity
}).sendAndConfirm(umi);

console.log(`NFT ${nftAddress} verified of member of collection ${collectionAddress}! See Explorer ${getExplorerLink("address", nftAddress, "devnet")}`);
