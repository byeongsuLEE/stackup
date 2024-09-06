import React from "react";
interface MajorProps {
  major: React.ComponentType<{ w: number; h: number; }>;
  title: string;
  name: string;
  value: string;
}

const Major: React.FC<MajorProps> = ({ major: MajorIcon, title, name, value }) => {

  // 라디오 버튼이 변경될 때 호출되는 함수
  // const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log(e.target.value); // 선택된 값 콘솔에 출력
  // };

  return (
    <div className="flex flex-col px-2 py-2 my-5 mx-1 border w-40 h-32 rounded-2xl">
      <input
        // onChange={handleRadioChange}
        type="radio" value={value} name={name} className="radio radio-success radio-xs" />
      <div className="flex flex-col items-center">
        <MajorIcon w={50} h={50} /> {/* major prop을 MajorIcon으로 받아서 사용 */}
        <span className="my-5">{title}</span>
      </div>
    </div>
  );
};
export default Major;