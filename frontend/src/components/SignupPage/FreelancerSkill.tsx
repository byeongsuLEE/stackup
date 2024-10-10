import { useForm } from 'react-hook-form';
import { freelanceSignupInfo } from "../../apis/User.type";
import WebIcon from "../../icons/WebIcon";
import { freelanceStore } from '../../store/FreelanceStore';
import DoneButton from '../common/DoneButton';
import Major from "./Major";
import Skill from "./Skill";
import { useNavigate } from 'react-router-dom';
import { registerFreelancerInfo } from '../../apis/UserApi';

const SkillInsert = () => {
  const navigate = useNavigate();

  const state = freelanceStore();
  const { register, handleSubmit } = useForm<freelanceSignupInfo>({});

  const onsubmit = (information: freelanceSignupInfo) => {
    state.setCareerYear(information.careerYear);
    state.setPortfolioURL(information.portfolioURL);
    state.setSelfIntroduction(information.selfIntroduction);

    registerFreelancerInfo();
    navigate(`/mypage/${sessionStorage.getItem('userId')}`);
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
              <Major major={WebIcon} category='classification' title="웹" name="category" value="web" />
              <Major major={WebIcon} category='classification' title="모바일" name="category" value="mobile" />
              <Major major={WebIcon} category='classification' title="퍼블리셔" name="category" value="publisher" />
              <Major major={WebIcon} category='classification' title="AI" name="category" value="ai" />
              <Major major={WebIcon} category='classification' title="DB" name="category" value="db" />
            </div>

            <span>사용언어(중복선택 가능)</span>
            <div className="flex">
              <Skill category="languages" name="python" title="Python" value="python" />
              <Skill category="languages" name="java" title="JAVA" value="java" />
              <Skill category="languages" name="c" title="C언어" value="c" />
              <Skill category="languages" name="c++" title="C++" value="c++" />
              <Skill category="languages" name="php" title="PHP" value="php" />
            </div>
            <div className="flex mb-5">
              <Skill category="languages" name="typescript" title="Typescript" value="typescript" />
              <Skill category="languages" name="javascript" title="Javascript" value="javascript" />
              <Skill category="languages" name="etc1" title="기타" value="etc" />
            </div>


            <span>프레임워크(중복선택 가능)</span>
            <div className="flex">
              <Skill category="frameworks" name="react" title="React" value="react" />
              <Skill category="frameworks" name="vue" title="Vue" value="vue" />
              <Skill category="frameworks" name="spring" title="Spring" value="spring" />
              <Skill category="frameworks" name="django" title="Django" value="django" />
              <Skill category="frameworks" name="etc" title="기타" value="etc" />
            </div>

            <span className="mt-5">경력</span>
            <input
              placeholder="년"
              className="mt-2 text-right px-2 border border-subGreen2 w-52 h-10 rounded-xl"
              type="text"
              {...register("careerYear", { required: "경력을 입력해주세요." })}
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
            <DoneButton height={40} width={100} title="저장" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SkillInsert;
