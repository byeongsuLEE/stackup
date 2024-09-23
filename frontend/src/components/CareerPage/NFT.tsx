interface NFTProps {
  title: string;
  period: string;
  name: string;
}
const NFT = ({title, period, name}:NFTProps) => {

  return (
    <div className="bg-black flex flex-col text-white text-sm w-[200px] my-5 h-[300px] rounded-lg p-5">
      <span className="text-lg mt-10">
        {title}
        </span>
      <span className="text-xs">
      {period}
      </span>
      <span className="mt-5">
      {name}
      </span>
    </div>
  )
}
export default NFT; 