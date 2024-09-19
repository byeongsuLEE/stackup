import React from "react";
import { freelanceStore } from "../../store/FreelanceStore";
interface MajorProps {
  major: React.ComponentType<{ w: number; h: number; }>;
  title: string;
  name: string;
  value: string;
}

const Major: React.FC<MajorProps> = ({ major: MajorIcon, title, name, value }) => {

  const state = freelanceStore();

  return (
    <div className="flex flex-col px-2 py-2 my-5 mx-1 border w-40 h-32 rounded-2xl">
      <input
        type="radio"
        value={value}
        name={name}
        className="radio radio-success radio-xs"
        checked={state.classification === value}
        onChange={() => state.setClassification(value)}
        />
      <div className="flex flex-col items-center">
        <MajorIcon w={50} h={50} /> {/* major prop을 MajorIcon으로 받아서 사용 */}
        <span className="my-5">{title}</span>
      </div>
    </div>
  );
};
export default Major;