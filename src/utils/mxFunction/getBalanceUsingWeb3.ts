import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js";

export async function getBalanceUsingAddress(address: string): Promise<number> {
    const key = new PublicKey(address)
    return getBalanceUsingWeb3(key);
}

export async function getBalanceUsingWeb3(address: PublicKey): Promise<number> {
    const connection = new Connection(clusterApiUrl('devnet'));
    const balance = await connection.getBalance(address);
    console.log('balance', balance);
    return balance / LAMPORTS_PER_SOL;
}