import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import
import Web3 from "web3";
import { AbiItem } from 'web3-utils';
import MyNFT from "../../../../blockchain/NFT/build/contracts/MyNFT.json"; // JSON 파일 임포트
import AlertBox from "../common/AlertBox";

interface Attribute {
  trait_type: string;
  value: string;
}

// 지갑 연결 함수
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
    return null; // MetaMask 설치 안됨
  }
};

// 메타데이터에서 이미지 URL과 문서 URL을 추출하는 함수
const fetchMetadata = async (tokenURI: string): Promise<{ image: string; document: string | null }> => {
  try {
    const response = await fetch(tokenURI); // tokenURI에서 메타데이터 JSON을 가져옴
    const metadata = await response.json();
    const image = metadata.image || null;
    const documentAttribute = metadata.attributes?.find(
      (attr: Attribute) => attr.trait_type === "Document"
    );
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
  abi: AbiItem[]
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

        if (!tokenId) {
          continue;
        }

        const tokenURI: string = await contract.methods.tokenURI(tokenId).call();

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

    return nftData;
  } catch (error) {
    console.error("전체 과정 중 오류 발생:", error);
    return [];
  }
};

const NFTDisplay = () => {
  const NFT_ABI = MyNFT.abi;
  const [, setAccount] = useState<string | null>(null);
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(true);
  const NFT_CONTRACT_ADDRESS = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;
  const navigate = useNavigate(); // useNavigate 훅

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      const userAccount = await connectWallet();
      setAccount(userAccount);

      if (!window.ethereum) {
        // MetaMask가 없을 때 경고 메시지를 상태로 설정하고 현재 URL을 저장
        setShowAlert(true);
        localStorage.setItem("redirectAfterMetaMaskInstall", window.location.href); // 현재 URL 저장
        window.open("https://metamask.io/download.html", "_blank"); // MetaMask 설치 페이지를 새 창으로 열기
      } else if (userAccount) {
        const nftData = await getNFTs(userAccount, NFT_CONTRACT_ADDRESS, NFT_ABI);
        setNfts(nftData);
      } else {
        setNfts([]); // 사용자 계정이 없을 경우 빈 배열 설정
      }

      setLoading(false);
    };

    // MetaMask 설치 후 돌아왔을 때 원래 페이지로 리디렉션
    const checkMetaMaskInstalled = () => {
      const redirectURL = localStorage.getItem("redirectAfterMetaMaskInstall");
      if (window.ethereum && redirectURL) {
        localStorage.removeItem("redirectAfterMetaMaskInstall");
        window.location.href = redirectURL; // 설치 후 저장된 페이지로 리다이렉트
      }
    };

    fetchNFTs();

    // 일정 시간마다 MetaMask 설치 여부를 확인 (다른 탭에서 돌아왔을 때 감지)
    const interval = setInterval(() => {
      if (window.ethereum) {
        checkMetaMaskInstalled();
      }
    }, 1000); // 1초마다 확인

    // 계정 변경 감지
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          fetchNFTs(); // 계정 변경 시 NFT 다시 가져오기
        } else {
          setAccount(null);
          setNfts([]);
        }
      });
    }

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(interval);
  }, [NFT_CONTRACT_ADDRESS, NFT_ABI, navigate]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
      {showAlert && <AlertBox title="MetaMask가 설치되지 않았습니다. 설치 페이지로 이동합니다." />}
      <div>
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
            <p className="mt-10">소유한 NFT가 없습니다.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default NFTDisplay;
