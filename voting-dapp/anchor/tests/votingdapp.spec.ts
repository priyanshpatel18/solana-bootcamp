import * as anchor from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { BankrunProvider, startAnchor } from 'anchor-bankrun';
import { Voting } from 'anchor/target/types/voting';
const IDL = require("../target/idl/voting.json");

const votingAddress = new PublicKey("6z68wfurCMYkZG51s1Et9BJEd9nJGUusjHXNt4dGbNNF");

describe('Voting Program', () => {
  let context;
  let provider;
  let votingProgram: anchor.Program<Voting>;

  beforeAll(async () => {
    context = await startAnchor("", [{ name: "voting", programId: votingAddress }], []);
    provider = new BankrunProvider(context);
    votingProgram = new anchor.Program<Voting>(
      IDL,
      provider
    )
  });

  it('initializePoll', async () => {
    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "Preferred Protein Type",
      "Do you prefer Isolate or Regular Whey?",
      new anchor.BN(0),
      new anchor.BN(1839200000),
    ).rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
      votingAddress
    );

    const poll = await votingProgram.account.pollAccount.fetch(pollAddress);

    expect(poll.pollId.toNumber()).toBe(1);
    expect(poll.pollName).toBe("Preferred Protein Type");
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
  });

  it('initializeCandidate', async () => {
    await votingProgram.methods.initializeCandidate(
      new anchor.BN(1),
      "Regular Whey",
    ).rpc();
    await votingProgram.methods.initializeCandidate(
      new anchor.BN(1),
      "Isolated Whey",
    ).rpc();

    const [regularWheyAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Regular Whey")],
      votingAddress
    );

    const regularWhey = await votingProgram.account.candidateAccount.fetch(regularWheyAddress);

    const [isolatedWheyAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Isolated Whey")],
      votingAddress
    );

    const isolatedWhey = await votingProgram.account.candidateAccount.fetch(isolatedWheyAddress);

    expect(regularWhey.candidateName).toBe("Regular Whey");
    expect(isolatedWhey.candidateName).toBe("Isolated Whey");
    expect(regularWhey.candidateVotes.toNumber()).toBe(0);
    expect(isolatedWhey.candidateVotes.toNumber()).toBe(0);
  })

  it("vote", async () => {
    await votingProgram.methods.vote(
      new anchor.BN(1),
      "Isolated Whey",
    ).rpc();

    const [isolatedWheyAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Isolated Whey")],
      votingAddress
    );

    const isolatedWhey = await votingProgram.account.candidateAccount.fetch(isolatedWheyAddress);
    expect(isolatedWhey.candidateVotes.toNumber()).toBe(1);
  })
});
