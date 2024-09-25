import { useState } from "react";
import DoneButton from "../components/common/DoneButton";
import { CallTest } from "../hooks/Test";

const Test = () => {
  const { Minting } = CallTest()
  const ethereum = window.ethereum;

  const [addr, setAddr] = useState("");
  //const web3 = new Web3(Web3.givenProvider);
  const handleGetAcount = async e => {
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    setAddr(account);
  };

  if (ethereum) {
    ethereum.on("accountsChanged", function (accounts) {
      setAddr(accounts[0]);
    });
  }

  // 버튼 클릭 시 호출될 핸들러 함수
  const handleMintNFT = async () => {
    try {
      // NFT 발행
      await Minting()
      alert("NFT 발행 호출");
    } catch (error) {
      console.error("NFT 발행 오류:", error);
      alert("NFT 발행 실패");
    }
  };


  return (
    <div>
      {ethereum && (
        <div onClick={handleGetAcount} >
          <DoneButton height={30} width={200} title="Connect Wallet" />
        </div>
      )}
      {ethereum && <p>Your Wallet address: {addr}</p>}


      <div onClick={handleMintNFT}>
        <DoneButton height={30} width={200} title="Contract 배포" />
      </div>
    </div>
  )
}
export default Test;