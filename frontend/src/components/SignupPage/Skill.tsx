import { freelanceStore } from "../../store/FreelanceStore";

interface SkillProps {
  category: "languages" | "frameworks";
  title: string;
  name: string;
  value?: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // onChange 추가
}

const Skill = ({ category, title, name, value, checked, onChange }: SkillProps) => {
  const { frameworks, languages, addFramework, removeFramework, addLanguage, removeLanguage } = freelanceStore((state) => ({
    frameworks: state.frameworks,
    languages: state.languages,
    addFramework: state.addFramework,
    removeFramework: state.removeFramework,
    addLanguage: state.addLanguage,
    removeLanguage: state.removeLanguage,
  }));

  const choiceFramework = (value: string) => {
    if (frameworks.includes(value)) {
      removeFramework(value);
    } else {
      addFramework(value);
    }
  };

  const choiceLanguage = (value: string) => {
    if (languages.includes(value)) {
      removeLanguage(value);
    } else {
      addLanguage(value);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (value) { // value가 undefined가 아닐 때만 처리
      if (category === "languages") {
        choiceLanguage(value);
      } else if (category === "frameworks") {
        choiceFramework(value);
      }
    }

    if (onChange) {
      onChange(event);
    }
  };

  const isChecked =
    checked !== undefined
      ? checked
      : (category === "languages" && languages.includes(value!)) || // non-null assertion operator 사용
      (category === "frameworks" && frameworks.includes(value!)); // non-null assertion operator 사용


  return (
    <div className="flex flex-col px-2 py-2 mt-5 mx-1 border w-40 h-20 rounded-2xl">
      <input
        value={value}
        type="radio"
        name={name}
        className="radio radio-success radio-xs"
        checked={isChecked}
        onChange={handleChange}
      />

      <div className="flex flex-col items-center">
        <span className="my-2">{title}</span>
      </div>
    </div>
  )
}
export default Skill;