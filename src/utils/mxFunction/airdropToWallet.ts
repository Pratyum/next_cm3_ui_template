import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

const airdropToWallet = (connection : Connection , publicKey : PublicKey,recieverWallet:string, amount:number) => {
    if (!connection || !publicKey) { return }
    const transaction = new Transaction()
    const recipientPubKey = new PublicKey(recieverWallet)

    const sendSolInstruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipientPubKey,
        lamports: LAMPORTS_PER_SOL * amount
    });

    transaction.add(sendSolInstruction)
    return transaction;
}

export default airdropToWallet;