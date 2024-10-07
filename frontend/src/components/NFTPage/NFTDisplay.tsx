import { useEffect, useState } from "react";
import Web3 from "web3";

// 지갑 연결
const connectWallet = async (): Promise<string | null> => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts[0] || null;
    } catch (error) {
      console.error("지갑 연결 실패:", error);
      alert("지갑 연결 실패: " + error);
      return null;
    }
  } else {
    alert("MetaMask가 설치되지 않았습니다.");
    return null;
  }
};

// 메타데이터에서 이미지 URL과 문서 URL을 추출하는 함수
const fetchMetadata = async (tokenURI: string): Promise<{ image: string; document: string | null }> => {
  try {
    const response = await fetch(tokenURI); // tokenURI에서 메타데이터 JSON을 가져옴
    const metadata = await response.json();
    const image = metadata.image || null;
    const documentAttribute = metadata.attributes?.find((attr: any) => attr.trait_type === "Document");
    const document = documentAttribute ? documentAttribute.value : null;

    return { image, document };
  } catch (error) {
    console.error("메타데이터를 가져오는 데 실패했습니다:", error);
    return { image: "", document: null };
  }
};

// NFT 정보 가져오기
interface NFTData {
  tokenId: string;
  imageURL: string;
  documentURL: string | null;
}

const getNFTs = async (
  account: string,
  contractAddress: string,
  abi: any
): Promise<NFTData[]> => {
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(abi, contractAddress);

  try {
    const balance = await contract.methods.balanceOf(account).call();
    const numBalance = Number(balance);

    if (isNaN(numBalance) || numBalance <= 0) {
      console.error("유효하지 않은 balance 값입니다:", balance);
      return []; // 빈 배열 반환
    }

    const nftData: NFTData[] = [];

    for (let i = 0; i < numBalance; i++) {
      try {
        const tokenId = await contract.methods.tokenOfOwnerByIndex(account, i).call();
        const tokenURI = await contract.methods.tokenURI(tokenId).call();

        // tokenURI에서 메타데이터의 이미지와 문서 URL을 가져옴
        const { image, document } = await fetchMetadata(tokenURI);

        if (image) {
          nftData.push({ tokenId: tokenId.toString(), imageURL: image, documentURL: document });
        } else {
          console.error(`이미지 URL을 가져오지 못했습니다. Token ID: ${tokenId}`);
        }
      } catch (innerError) {
        console.error(`토큰 ID ${i} 가져오기 실패:`, innerError);
      }
    }

    return nftData; // NFT 데이터 배열 반환
  } catch (error) {
    console.error("NFT 정보 가져오기 실패:", error);
    return []; // 빈 배열 반환
  }
};

import MyNFT from "../../../../blockchain/NFT/build/contracts/MyNFT.json"; // JSON 파일 임포트

const NFTDisplay = () => {
  const NFT_ABI = MyNFT.abi;
  const [account, setAccount] = useState<string | null>(null);
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(true);
  const NFT_CONTRACT_ADDRESS = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      const userAccount = await connectWallet();
      setAccount(userAccount);

      if (userAccount) {
        const nftData = await getNFTs(userAccount, NFT_CONTRACT_ADDRESS, NFT_ABI);
        setNfts(nftData);
      } else {
        setNfts([]); // 사용자 계정이 없을 경우 빈 배열 설정
      }

      setLoading(false);
    };

    fetchNFTs();

    // 계정 변경 감지
    window.ethereum.on("accountsChanged", (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        fetchNFTs(); // 계정 변경 시 NFT 다시 가져오기
      } else {
        setAccount(null);
        setNfts([]);
      }
    });
  }, [NFT_CONTRACT_ADDRESS, NFT_ABI]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      {/* <h1>{account ? `${account}님의 NFT` : "지갑을 연결하세요."}</h1> */}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {nfts.length > 0 ? (
          nfts.map((nft) => (
            <div key={nft.tokenId} className="m-7">
              {nft.imageURL ? (
                <a href={nft.documentURL || "#"} target="_blank" rel="noopener noreferrer">
                  <img className="rounded-lg" src={nft.imageURL} alt={`NFT`} width="200" />
                </a>
              ) : (
                <p>이미지를 가져오는 데 실패했습니다.</p>
              )}
            </div>
          ))
        ) : (
          <p>소유한 NFT가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default NFTDisplay;
