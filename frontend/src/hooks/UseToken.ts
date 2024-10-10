import { AbiItem } from 'web3-utils';
import { useWeb3 } from './UseWeb3';

const SSF_TOKEN_CONTRACT_ADDRESS = '0x066b74Fc73bfaf0C266b0269F91dDeeB5aAB6998';

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
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

const useSendSSFTokens = () => {
  const { account, web3 } = useWeb3();


  const sendSSFToken = async (toAddress: string, amount: number) => {
    if (!web3 || !account) return;

    const ssfContract = new web3.eth.Contract(ERC20_ABI as AbiItem[], SSF_TOKEN_CONTRACT_ADDRESS);

    try {
      // 토큰의 소수점을 고려한 전송 금액 계산
      const decimal: number = await ssfContract.methods.decimals().call();
      // const tokenAmount = web3.utils.toBN(amount * 10 ** decimal);
      const tokenAmount = BigInt(amount) * BigInt(10) ** BigInt(decimal);
      const gasPrice = await web3.eth.getGasPrice();

      // 트랜잭션 전송
      const receipt = await ssfContract.methods
        .transfer(toAddress, tokenAmount)
        .send({ from: account, gasPrice: gasPrice.toString() });

      console.log('Transaction successful with receipt: ', receipt);
    } catch (error) {
      console.error('Error sending SSF tokens:', error);
    }
  };

  return { sendSSFToken };
};

export default useSendSSFTokens;
