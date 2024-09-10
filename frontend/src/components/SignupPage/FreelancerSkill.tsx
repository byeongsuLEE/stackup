import WebIcon from "../../icons/WebIcon";
import { freelanceLanguageStore } from "../../store/FreelanceStore";
import { useForm } from "react-hook-form";
import Button from "../common/DoneButton";
import Major from "./Major";
import Skill from "./Skill";
import { freelanceSignupInfo } from "../../apis/User.type";
import { freelanceInformation } from "../../apis/UserApi";

const SkillInsert = () => {
  const state = freelanceLanguageStore();
  const { register, handleSubmit } = useForm<freelanceSignupInfo>({});

  //== framework 추가 ==//
  const choiceFramework = (value: string) => {
    if (state.frameworks.includes(value)) {
      state.removeFramework(value);
    } else {
      state.addFramework(value);
    }
  };

  //== language 추가 ==//
  const choiceLanguage = (value: string) => {
    if (state.languages.includes(value)) {
      state.removeLanguage(value);
    } else {
      state.addLanguage(value);
    }
  };

  const onsubmit = (information: freelanceSignupInfo) => {
    state.setCareerYear(information.careerYear);
    state.setPortfolioURL(information.portfolioURL);
    state.setSelfIntroduction(information.selfIntroduction);

    freelanceInformation();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className="bg-bgGreen flex flex-col w-[900px] h-auto border border-mainGreen ">
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold mt-10 mb-2 text-subGreen2">
              프리랜서로 시작하기
            </span>
            <span className="text-sm mb-10 text-subTxt">
              서비스 이용에 필요한 정보를 입력해주세요.
            </span>
          </div>

          <div className="flex flex-col ml-10">
            <span>대분류</span>
            <div
              className="flex"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => state.setClassification(e.target.value)}>
              <Major major={WebIcon} title="웹" name="category" value="web" />
              <Major major={WebIcon} title="모바일" name="category" value="mobile" />
              <Major major={WebIcon} title="퍼블리셔" name="category" value="publisher" />
              <Major major={WebIcon} title="AI" name="category" value="ai" />
              <Major major={WebIcon} title="DB" name="category" value="db" />
            </div>

            <span>사용언어(중복선택 가능)</span>
            <div onChange={(e: React.ChangeEvent<HTMLInputElement>) => choiceLanguage(e.target.value)}>
              <div className="flex">
                <Skill name="python" title="Python" value="python" />
                <Skill name="java" title="JAVA" value="java" />
                <Skill name="c" title="C언어" value="c" />
                <Skill name="c++" title="C++" value="c++" />
                <Skill name="php" title="PHP" value="php" />
              </div>
              <div className="flex mb-5">
                <Skill
                  name="typescript"
                  title="Typescript"
                  value="typescript"
                />
                <Skill
                  name="javascript"
                  title="Javascript"
                  value="javascript"
                />
                <Skill name="etc1" title="기타" value="etc" />
              </div>
            </div>

            <span>프레임워크(중복선택 가능)</span>
            <div
              className="flex"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => choiceFramework(e.target.value)}>
              <Skill name="react" title="React" value="react" />
              <Skill name="vue" title="Vue" value="vue" />
              <Skill name="spring" title="Spring" value="spring" />
              <Skill name="django" title="Django" value="django" />
              <Skill name="etc" title="기타" value="etc" />
            </div>

            <span className="mt-5">경력</span>
            <input
              placeholder="년"
              className="mt-2 text-right px-2 border border-subGreen2 w-52 h-10 rounded-xl"
              type="text"
              defaultValue="년"
              {...register("careerYear", { required: "경력을 입력해주세요." })}
            />

            <span className="mt-5">포트폴리오 링크</span>
            <input
              type="text"
              className="px-2 mt-2 border border-subGreen2 w-72 h-10 rounded-xl"
              {...register("portfolioURL", {
                required: "포트폴리오 URL을 입력해주세요.",
              })}
            />

            <span className="mt-5">한 줄 자기소개</span>
            <input
              type="text"
              className="px-2 mt-2 border border-subGreen2 w-72 h-10 rounded-xl"
              {...register("selfIntroduction", {
                required: "자기소개를 입력해주세요.",
              })}
            />
          </div>
          <div className="flex justify-end mr-10 my-5">
            <Button height={40} width={100} title="저장" />
          </div>
        </div>
      </form>
    </div>
  );
};
export default SkillInsert;
