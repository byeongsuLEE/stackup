import WebIcon from "../../icons/WebIcon";
import Major from "../SignupPage/Major";
import Skill from "../SignupPage/Skill";

const UserInfo = () => {
  return (
    <form>
      <div className="bg-bgGreen flex flex-col my-10 p-10 border mx-20 border-mainGreen w-auto h-auto rounded-lg">
        <div className="flex">
          
          <div className="flex flex-col text-subTxt">
            <label className="text-black" htmlFor="name">이름</label>
            <label htmlFor="email">이메일</label>
            <label htmlFor="phoneNumber">전화번호</label>
          </div>

          <div className="flex flex-col">
            <input
              id="name"
              className="border my-2 px-2 border-gray-400 w-48 rounded-md h-8"
              type="text"
            />
            <input
              id="email"
              className="border my-2 px-2 border-gray-400 w-48 rounded-md h-8"
              type="text"
            />
            <input
              id="phoneNumber"
              className="border my-2 px-2 border-gray-400 w-48 rounded-md h-8"
              type="text"
            />
          </div>

        </div>

        <div className="flex flex-col ml-10">
          <span>대분류</span>
          <div className="flex">
            <Major major={WebIcon} title="웹" name="category" value='web' />
            <Major major={WebIcon} title="모바일" name="category" value='mobile' />
            <Major major={WebIcon} title="퍼블리셔" name="category" value='publisher' />
            <Major major={WebIcon} title="AI" name="category" value='ai' />
            <Major major={WebIcon} title="DB" name="category" value='db' />
          </div>

          <span>사용언어(중복선택 가능)</span>
          <div>
            <div className="flex">
              <Skill name="python" title="Python" value='python' />
              <Skill name="java" title="JAVA" value='java' />
              <Skill name="c" title="C언어" value='c' />
              <Skill name="c++" title="C++" value='c++' />
              <Skill name="php" title="PHP" value='php' />
            </div>
            <div className="flex mb-5">
              <Skill name="typescript" title="Typescript" value='typescript' />
              <Skill name="javascript" title="Javascript" value='javascript' />
              <Skill name="etc1" title="기타" value='etc' />
            </div>
          </div>

          <span>프레임워크(중복선택 가능)</span>
          <div className="flex">
            <Skill name="react" title="React" value='react' />
            <Skill name="vue" title="Vue" value='vue' />
            <Skill name="spring" title="Spring" value='spring' />
            <Skill name="django" title="Django" value='django' />
            <Skill name="etc" title="기타" value='etc' />
          </div>

          <span className="mt-5">경력</span>
          <input
            placeholder="년"
            className="mt-2 text-right px-2 border border-subGreen2 w-52 h-10 rounded-xl"
            type="text"
            defaultValue="년" />

          <span className="mt-5">포트폴리오 링크</span>
          <input
            type="text"
            className="px-2 mt-2 border border-subGreen2 w-72 h-10 rounded-xl"
          />

          <span className="mt-5">한 줄 자기소개</span>
          <input
            type="text"
            className="px-2 mt-2 border border-subGreen2 w-72 h-10 rounded-xl"
          />
        </div>

      </div>
    </form>
  )
}
export default UserInfo;
