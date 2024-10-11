import React from "react";
import { freelanceStore } from "../../store/FreelanceStore";
import { WebIconProps } from "../../icons/WebIcon";

interface MajorProps {
  major: React.ComponentType<WebIconProps>;
  category: "classification" | "level";
  title: string;
  name: string;
  value?: string;
  checked?:boolean;
  onChange?: (value: string) => void;
}

const Major: React.FC<MajorProps> = ({ major: MajorIcon, category, title, name, value, checked, onChange }) => {

  const { level, classification, setClassification, setLevel } = freelanceStore((state) => ({
    level : state.level,
    classification : state.classification,
    setLevel: state.setLevel,
    setClassification: state.setClassification
  }));

  const isChecked = checked !== undefined? checked : (
    (category === "classification" && classification === value) ||
    (category === "level" && level === value)
  );

  const handleChange = () => {
    if (value !== undefined) {
      if (category === "classification") {
        setClassification(value);
      } else if (category === "level") {
        setLevel(value);
      }
      if (onChange) {
        onChange(value); // onChange 호출
      }
    }
  };

  return (
    <div className="flex flex-col px-2 py-2 my-5 mx-1 border w-40 h-32 rounded-2xl">
      <input
        type="radio"
        value={value}
        name={name}
        className="radio radio-success radio-xs"
        checked={isChecked}
        onChange={handleChange}
      />
      <div className="flex flex-col items-center">
        <MajorIcon w={30} h={30}/> {/* major prop을 MajorIcon으로 받아서 사용 */}
        <span className="my-5">{title}</span>
      </div>
    </div>
  );
};
export default Major;