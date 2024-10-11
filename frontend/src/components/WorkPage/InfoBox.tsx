interface InfoBoxProps {
  title: string;
  content?: any;
  category?: string;
  isAnomaly?: boolean;
  info:React.ComponentType<{ w: number; h: number; }>
}

const InfoBox: React.FC<InfoBoxProps> = ({title, category, content, info:InfoIcon, isAnomaly})=>{

  if (content == undefined && category === "applicants") {
    content = "0명"
  }

  if (category === "deposit") {
    content = new Intl.NumberFormat().format(parseInt(content, 10)) + " 만원";
  }

  return (
    <div className="bg-white flex items-center justify-between p-5 border mx-2 border-mainGreen rounded-xl w-[300px] h-[100px]">

      <div className="flex items-center">
      <InfoIcon w={20} h={20} />
      <span className="ml-3">{title}</span>
      </div>
      <div className="flex items-center">
        <span>{content}</span>
        {category === "deposit" && isAnomaly !== undefined && (
          <span className={`ml-2 ${isAnomaly ? "text-red-500" : "text-green-500"}`}>
            {isAnomaly ? "⚠️" : "✅"}
          </span>
        )}
      </div>

    </div>
  )
}
export default InfoBox;