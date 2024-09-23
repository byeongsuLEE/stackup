import { useEffect, useState } from "react";
import { useWeb3 } from "../../hooks/useWeb3";

const Wallet = () => {
  const { account, web3, ssfBalance } = useWeb3();
  const [isLogin, setIsLogin] = useState<boolean>();
  const [balance, setBalance] = useState<number>();


  useEffect(() => {
    if (account === null) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [account]);

  return (
    <>
    {isLogin?(
      <div className="bg-bgGreen w-auto h-[120px] flex flex-col border border-mainGreen rounded-lg p-5">
        <span>나의 지갑 정보</span>
        <span>계정 : {account}</span>
        <span>잔액 : {ssfBalance} SSF</span>
      </div>
    ):(
      <div className="text-center mb-5">
        <span className="mr-1">
        NFT경력관리를 위한 지갑을 사용을 위해
        </span>
        <a className=" text-blue-500 underline" href="https://metamask.io/ko/">
        MetaMask
        </a>
        <span>
        를 설치해주세요.
        </span>
      </div>
    )}
    </>
  )
}
export default Wallet;