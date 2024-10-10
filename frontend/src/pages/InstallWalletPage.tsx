import MetamaskIcon from "../icons/MetamaskIcon";

const InstallWallet = () => {
  return (
    <div className="flex flex-col items-center my-20">
      <a className="text-subGreen1 font-bold" href="https://metamask.io/ko/download/">
        메타마스크 설치하러 가기
      </a>
      <a className="mt-5" href="https://metamask.io/ko/download/">
        <MetamaskIcon />
      </a>
    </div>
  )
}
export default InstallWallet;
