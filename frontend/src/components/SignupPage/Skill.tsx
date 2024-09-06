interface SkillProps {
  title: string;
  name: string;
  value?: string;
}

const Skill = ({title, name, value}:SkillProps)=>{
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value); // 선택된 값 콘솔에 출력
  };
  return (
    <div className="flex flex-col px-2 py-2 mt-5 mx-1 border w-40 h-20 rounded-2xl">
      <input
      onChange={handleRadioChange}
      value={value}
      type="radio" name={name} className="radio radio-success radio-xs" />
      <div className="flex flex-col items-center">
        <span className="my-2">{title}</span>
      </div>
    </div>
  )
}
export default Skill;