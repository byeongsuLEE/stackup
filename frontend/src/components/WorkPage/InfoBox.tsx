interface InfoBoxProps {
  title: string;
  content?: any;
  category: string;
  info:React.ComponentType<{ w: number; h: number; }>
}

const InfoBox: React.FC<InfoBoxProps> = ({title, category, content, info:InfoIcon})=>{

  if (content == undefined && category === "applicants") {
    content = "0명"
  }

  if (category === "deposit") {
    content = new Intl.NumberFormat().format(parseInt(content, 10)) + " 만원";
  }

  return (
    <div className="bg-white flex justify-between p-5 border mx-2 border-mainGreen rounded-xl w-[300px] h-[100px]">
      <div className="flex h-fit items-center">
      <InfoIcon w={20} h={20} />
      <span className="ml-3">{title}</span>
      </div>
      <span>{content}</span>
    </div>
  )
}
export default InfoBox;