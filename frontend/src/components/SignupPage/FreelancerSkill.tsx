import WebIcon from "../../icons/WebIcon";
import Button from "../common/DoneButton";
import Major from "./Major";
import Skill from "./Skill";

const SkillInsert = () => {

  return (
    <div>
      <form>
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
            <div className="flex">
              <Major major={WebIcon} title="웹" name="web" value='web'/>
              <Major major={WebIcon} title="모바일" name="web" value='web'/>
              <Major major={WebIcon} title="퍼블리셔" name="web" value='web'/>
              <Major major={WebIcon} title="AI" name="web" value='web'/>
              <Major major={WebIcon} title="DB" name="web" value='web'/>
            </div>

            <span>사용언어(중복선택 가능)</span>
            <div className="flex">
              <Skill name="skill" title="Python" />
              <Skill name="skill" title="JAVA" />
              <Skill name="skill" title="C언어" />
              <Skill name="skill" title="C++" />
              <Skill name="skill" title="PHP" />
            </div>
            <div className="flex mb-5">
              <Skill name="skill" title="Typescript" />
              <Skill name="skill" title="Javascript" />
              <Skill name="skill" title="기타" />
            </div>
            <span>프레임워크(중복선택 가능)</span>
            <div className="flex">
              <Skill name="framework" title="React" />
              <Skill name="framework" title="Vue" />
              <Skill name="framework" title="Spring" />
              <Skill name="framework" title="Django" />
              <Skill name="framework" title="기타" />
            </div>
            <span className="mt-5">경력</span>
            <input placeholder="년" className="mt-2 text-right px-2 border border-subGreen2 w-52 h-10 rounded-xl" type="text" defaultValue="년" />
            <span className="mt-5">포트폴리오 링크</span>
            <input type="text" className="px-2 mt-2 border border-subGreen2 w-72 h-10 rounded-xl" />
            <span className="mt-5">한 줄 자기소개</span>
            <input type="text" className="px-2 mt-2 border border-subGreen2 w-72 h-10 rounded-xl" />
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
