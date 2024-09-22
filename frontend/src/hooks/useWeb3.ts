// import { MetaMaskInpageProvider } from '@metamask/providers';

// import { useEffect, useState } from 'react';

// export const useWeb3 = () => {
//   const [account, setAccount] = useState(false);

//   const getCurChainId = async () => {
//     const eth = window.ethereum as MetaMaskInpageProvider;
//     const curChainId = await eth.request({
//       method: 'eth_chainId',
//     });

//     return curChainId;
//   };

//   const addAndConnNetwork = async (chainId: string) => {
//     const eth = window.ethereum as MetaMaskInpageProvider;

//     const network = {
//       chainId,
//       chainName: 'SSAFY',
//       rpcUrls: ['https://rpc.ssafy-blockchain.com'],
//       nativeCurrency: {
//         name: 'SSF Token',
//         symbol: 'SSF',
//         decimals: 18,
//       },
//     };

//     await eth.request({
//       method: 'wallet_addEthereumChain',
//       params: [network],
//     });
//   };

//   useEffect(() => {
//     (async function () {
//       if (window.ethereum !== undefined) {
//         const curChainId = await getCurChainId();
//         const targetChainId = '0x1e2a';

//         if (curChainId !== targetChainId) {
//           await addAndConnNetwork(targetChainId);
//         }
//       }
//     })();
//   });
// };


import { MetaMaskInpageProvider } from '@metamask/providers';
import { useEffect, useState } from 'react';

export const useWeb3 = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [isRequestPending, setIsRequestPending] = useState(false); // 요청 상태 관리

  const getCurChainId = async (): Promise<string | null> => {
    const eth = window.ethereum as MetaMaskInpageProvider;
    try {
      const curChainId = await eth.request({
        method: 'eth_chainId',
      });
      console.log(curChainId)
      return curChainId as string;
    } catch (error) {
      console.error('체인 ID 조회 중 에러:', error);
      return null;
    }
  };

  const addAndConnNetwork = async (chainId: string) => {
    const eth = window.ethereum as MetaMaskInpageProvider;

    const network = {
      chainId,
      chainName: 'SSAFY Blockchain Network',
      rpcUrls: ['https://rpc.ssafy-blockchain.com'],
      nativeCurrency: {
        name: 'SSF Token',
        symbol: 'SSF',
        decimals: 18,
      },
    };

    try {
      if (!isRequestPending) { // 요청 중이 아닐 때만 실행
        setIsRequestPending(true); // 요청 진행 상태로 설정
        await eth.request({
          method: 'wallet_addEthereumChain',
          params: [network],
        });
        console.log('네트워크 추가 및 연결 성공');
      } else {
        console.log('네트워크 추가 요청이 이미 진행 중입니다.');
      }
    } catch (error) {
      console.error('네트워크 추가 및 연결 중 에러:', error);
    } finally {
      setIsRequestPending(false); // 요청이 끝나면 상태를 false로 변경
    }
  };

  useEffect(() => {
    const connectToNetwork = async () => {
      if (window.ethereum !== undefined) {
        const curChainId = await getCurChainId();
        const targetChainId = '0x79f5'; // SSAFY Blockchain의 Chain ID (31221의 16진수)

        if (curChainId !== targetChainId) {
          await addAndConnNetwork(targetChainId);
        } else {
          console.log('이미 SSAFY 네트워크에 연결되어 있습니다.');
        }

        // 계정 가져오기
        // const eth = window.ethereum as MetaMaskInpageProvider;
        // const accounts = await eth.request({ method: 'eth_requestAccounts' });
        // setAccount(accounts ? accounts[0] : null); // 첫 번째 계정을 설정
      }
    };

    connectToNetwork();
  }, []); // 의존성 배열 추가하여 한 번만 실행되도록 설정

  return account;
};

