import { FC, useCallback, useEffect, useState } from "react";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { Grid } from "@/styles/home";
import Image from "next/image";

export const FetchNft: FC = () => {
  const [nftData, setNftData] = useState<any[]>([]);

  const { connection } = useConnection();
  const wallet = useWallet();
  const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));

  const fetchNfts = useCallback(async () => {
    if (!wallet.connected) return;
    if (!wallet.publicKey) return;

    // fetch NFTs for connected wallet
    const nfts = await metaplex
      .nfts()
      .findAllByOwner({ owner: wallet.publicKey });

    // fetch off chain metadata for each NFT
    let nftData = [];
    for (let i = 0; i < nfts.length; i++) {
      let fetchResult = await fetch(nfts[i].uri);
      let json = await fetchResult.json();
      nftData.push(json);
    }

    // set state
    setNftData(nftData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.connected, wallet.publicKey]);

  // fetch nfts when connected wallet changes
  useEffect(() => {
    fetchNfts()
  }, [fetchNfts])

  return <div>
    {nftData && (
        <Grid>
          {nftData.map((nft) => (
            <div key={nft.name}>
              <ul>{nft.name}</ul>
              <Image src={nft.image} alt={nft.name} width={40} height={40}  />
            </div>
          ))}
        </Grid>
      )}
  </div>;
};
