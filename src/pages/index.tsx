import {
  CTAButton,
  CTAContainer,
  CTAInfoContainer,
  HomeContainer,
  InfoDataContainer,
  MintInfoContainer,
  MintInfoData,
  MintInfoLeftContainer,
  MintInfoTitle,
  MintInfosContainer,
} from "@/styles/home";
import { getBalanceUsingAddress, getBalanceUsingWeb3 } from "@/utils/mxFunction/getBalanceUsingWeb3";
import { getMxState, verifyMint } from "@/utils/mxFunction/mXStore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { FetchNft } from "@/components/FetchNFT";
import { PublicKey } from "@solana/web3.js";
import airdropToWallet from "@/utils/mxFunction/airdropToWallet";
import mintNftV3 from "@/utils/mxFunction/mintNftV3";

export default function Home() {
  const [candyMachine, setCandyMachine] = useState<any>(null);
  const { connection } = useConnection();
  const wallet = useWallet();

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    (async () => {
      const { METAPLEX } = getMxState(connection);
      const candyMachine = await METAPLEX.candyMachines().findByAddress({
        address: new PublicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID!),
      });

      setCandyMachine(candyMachine);
    })();
  }, [connection]);

  const getWalletBalance = useCallback(async ( ) => {
    if (wallet?.publicKey) {
      const balance = await getBalanceUsingAddress(wallet.publicKey.toString());
      setBalance(balance);
    }
    return 0;
  },[wallet?.publicKey]);



  useEffect(() => {
    getWalletBalance();
  }, [getWalletBalance]);

  return (
    <HomeContainer>
      <CTAContainer>
        <MintInfoData>{balance} SOL</MintInfoData>        
        <CTAButton onClick={() =>{ 
          if(wallet?.publicKey){
            const transaction =  airdropToWallet(connection,wallet?.publicKey, wallet?.publicKey?.toString(), 0.1);
            if(transaction){
            wallet.sendTransaction(transaction, connection).then(sig => {
              console.log(`Explorer URL: https://explorer.solana.com/tx/${sig}?cluster=devnet`)
            });}
          }}}>
            Air drop 0.1 sol
          </CTAButton>
      </CTAContainer>

      <CTAContainer>
        <FetchNft/>
      </CTAContainer>

      <CTAContainer>
        <CTAInfoContainer>
          <MintInfosContainer>
            <MintInfoLeftContainer>
              <MintInfoContainer>
                <MintInfoTitle>Remaining</MintInfoTitle>
                <MintInfoData>
                  {candyMachine?.itemsRemaining.toNumber() ?? ""}
                </MintInfoData>
              </MintInfoContainer>
              <MintInfoContainer>
                <MintInfoTitle>Price</MintInfoTitle>
                <MintInfoData>@ 0.1</MintInfoData>
              </MintInfoContainer>
            </MintInfoLeftContainer>
            <MintInfoContainer>
              <InfoDataContainer>LIVE</InfoDataContainer>
            </MintInfoContainer>
          </MintInfosContainer>
          <CTAButton onClick={() => mintNftV3(connection, wallet)}>
            Mint
          </CTAButton>
          {/* <CTAButton onClick={() => verifyMint(connection)}>Verify</CTAButton> */}
        </CTAInfoContainer>
      </CTAContainer>
    </HomeContainer>
  );
}
