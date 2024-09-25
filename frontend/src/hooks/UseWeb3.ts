import { MetaMaskInpageProvider } from '@metamask/providers';
import { useEffect, useState } from 'react';
import Web3 from 'web3';

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
];

// 토큰 컨트랙트 주소
const SSF_TOKEN_CONTRACT_ADDRESS = '0x066b74Fc73bfaf0C266b0269F91dDeeB5aAB6998';

export const useWeb3 = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [ssfBalance, setSsfBalance] = useState<number | null>(null); // SSF 토큰 잔액 상태 추가


  const getCurChainId = async (): Promise<string | null> => {
    const eth = window.ethereum as MetaMaskInpageProvider;
    try {
      const curChainId = await eth.request({
        method: 'eth_chainId',
      });
      return curChainId as string;
    } catch (error) {
      console.error('Error fetching chain ID:', error);
      return null;
    }
  };

  const addAndConnNetwork = async (chainId: string) => {
    const eth = window.ethereum as MetaMaskInpageProvider;
    const network = {
      chainId,
      chainName: 'SSAFY',
      rpcUrls: ['https://rpc.ssafy-blockchain.com'],
      nativeCurrency: {
        name: 'SSF Token',
        symbol: 'ETH',
        decimals: 18,
      },
    };

    try {
      if (!isRequestPending) {
        setIsRequestPending(true);
        const response = await eth.request({
          method: 'wallet_addEthereumChain',
          params: [network],
        });
        console.log(response);
        console.log('Network added and connected successfully.');
      } else {
        console.log('Network addition request is already in progress.');
      }
    } catch (error) {
      console.error('Error adding and connecting network:', error);
    } finally {
      setIsRequestPending(false);
    }
  };

  const getAccount = async () => {
    const eth = window.ethereum as MetaMaskInpageProvider;
    try {
      const accounts = await eth.request({
        method: 'eth_requestAccounts',
      });
      return accounts;
    } catch (error) {
      console.error('Error fetching account:', error);
      return [];
    }
  };

  // SSF 토큰 잔액 조회 함수
  const fetchSsfBalance = async (web3Instance: Web3, userAccount: string) => {
    if (!web3Instance || !userAccount) return;

    const ssfContract = new web3Instance.eth.Contract(ERC20_ABI, SSF_TOKEN_CONTRACT_ADDRESS);

    try {
      const balance = await ssfContract.methods.balanceOf(userAccount).call();
      const decimals = await ssfContract.methods.decimals().call();

      const adjustedBalance = Number(balance) / 10 ** Number(decimals);
      setSsfBalance(adjustedBalance);
    } catch (error) {
      console.error('Error fetching SSF token balance:', error);
    }
  };

  useEffect(() => {
    const connectToNetwork = async () => {
      if (window.ethereum) {
        const curChainId = await getCurChainId();
        const targetChainId = '0x79f5';

        if (curChainId !== targetChainId) {
          await addAndConnNetwork(targetChainId);
        } else {
          console.log('Already connected to SSAFY network.');
        }

        const [userAccount] = (await getAccount()) as string[];
        setAccount(userAccount);

        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        // SSF 토큰 잔액 조회 호출
        await fetchSsfBalance(web3Instance, userAccount);
      }
    };

    connectToNetwork();
  }, []);

  return { account, web3, ssfBalance, isRequestPending, getAccount };
};
