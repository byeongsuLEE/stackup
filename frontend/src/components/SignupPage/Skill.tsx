import { freelanceStore } from "../../store/FreelanceStore";

interface SkillProps {
  category: string;
  title: string;
  name: string;
  value?: string;
}

const Skill = ({category, title, name, value}:SkillProps)=>{
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

  const categoryChoice = (category: string, value: string | undefined) => {
    if (value !== undefined && category === "languages") {
      choiceLanguage(value)
    } else if (value !== undefined && category === "frameworks") {
      choiceFramework(value)
    }
  }

  const isChecked = value !== undefined && (
    (category === "languages" && languages.includes(value)) ||
    (category === "frameworks" && frameworks.includes(value))
  );
  
  return (
    <div className="flex flex-col px-2 py-2 mt-5 mx-1 border w-40 h-20 rounded-2xl">
      <input
      value={value}
      type="radio"
      name={name}
      className="radio radio-success radio-xs"
      checked={isChecked}
      onChange={() => categoryChoice(category, value)}
      />

      <div className="flex flex-col items-center">
        <span className="my-2">{title}</span>
      </div>
    </div>
  )
}
export default Skill;