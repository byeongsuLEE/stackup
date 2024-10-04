import React from "react";
import { freelanceStore } from "../../store/FreelanceStore";
interface MajorProps {
  major: React.ComponentType;
  category: string;
  title: string;
  name: string;
  value?: string;
  checked?:boolean;
}

const Major: React.FC<MajorProps> = ({ major: MajorIcon, category, title, name, value, checked }) => {

  const { level, classification, setClassification, setLevel } = freelanceStore((state) => ({
    level : state.level,
    classification : state.classification,
    setLevel: state.setLevel,
    setClassification: state.setClassification
  }));

  const choiceClassification = (value: string) => {
    setClassification(value)
  };

  const choiceLevel = (value : string) => {
    setLevel(value)
  }

  const categoryChoice = (category: string, value: string | undefined) => {
    if (value !== undefined && category === "classification") {
      choiceClassification(value)
    } else if (value !== undefined && category === "level") {
      choiceLevel(value)
    }
  }

  const isChecked = checked !== undefined? checked : (
    (category === "classification" && classification === value) ||
    (category === "level" && level === value)
  );

  return (
    <div className="flex flex-col px-2 py-2 my-5 mx-1 border w-40 h-32 rounded-2xl">
      <input
        type="radio"
        value={value}
        name={name}
        className="radio radio-success radio-xs"
        checked={isChecked}
        onChange={() => categoryChoice(category, value)}
      />
      <div className="flex flex-col items-center">
        <MajorIcon /> {/* major prop을 MajorIcon으로 받아서 사용 */}
        <span className="my-5">{title}</span>
      </div>
    </div>
  );
};
export default Major;