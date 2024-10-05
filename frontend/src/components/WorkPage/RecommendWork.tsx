import { Framework, Language } from "../../apis/Board.type";
import { freelanceStore } from "../../store/FreelanceStore";

interface RecommendProps {
  title: string;
  classification: string;
  deposit: string;
  level: string;
  frameworks: Framework[];
  languages: Language[];
}

const RecommendWork = ({ title, classification, frameworks, languages }: RecommendProps) => {

  if (classification === 'web') {
    classification = '웹'
  } else if (classification === 'mobile') {
    classification = '모바일'
  } else if (classification === 'publisher') {
    classification = '퍼블리셔'
  } else if (classification === 'ai') {
    classification = 'AI'
  } else {
    classification = 'DB'
  }

  // frameworks와 languages 배열을 join으로 , 구분하여 출력
  const frameworksList = frameworks.map(framework => framework.framework.name);
  const languagesList = languages.map(language => language.language.name);

  

  console.log(name)
  return (
    <div>
      
      <div className="flex justify-between">
        <div className="flex flex-col bg-bgGreen mx-1 mt-3 w-[300px] h-[150px] border border-mainGreen rounded-xl px-5 py-5">
          <span className="font-bold text-xl">{title}</span>
          <span className="font-bold text-subTxt">{classification}</span>
          <span className="my-1">사용언어 및 프레임워크</span>
          <span>{languagesList.join(',')}, {frameworksList.join(',')}</span> {/* 언어 목록 */}
          <p></p> {/* 프레임워크 목록 */}
        </div>
      </div>

    </div>
  );
};
export default RecommendWork;
