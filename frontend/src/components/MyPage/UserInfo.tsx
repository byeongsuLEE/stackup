import React, { useEffect, useState } from "react";
import WebIcon from "../../icons/WebIcon";
import { freelanceInformation } from "../../store/FreelanceStore";
import Major from "../SignupPage/Major";
import Skill from "../SignupPage/Skill";
import DoneButton from "../common/DoneButton";
import { registerFreelancerInfo } from "../../apis/UserApi";

const UserInfo = (data: freelanceInformation) => {
  const [local, setLocal] = useState(data);

  useEffect(() => {
    setLocal(data)

  }, [data])
  
  const changeValue = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocal((value) => ({
      ...value,
      [key]:e.target.value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    data.updateState(local)

    registerFreelancerInfo();
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-bgGreen flex flex-col my-10 p-10 border  border-mainGreen w-auto h-auto rounded-lg">
        <div className="flex flex-col ml-10">
          <label htmlFor="name">이름</label>
          <input
            id="name"
            className="border my-2 px-2  border-gray-400 w-48 h-8 rounded-md"
            type="text"
            value={ local.name }
            onChange={changeValue('name')}
          />

          <label htmlFor="email">이메일</label>
          <input
            id="email"
            className="border my-2 px-2 border-gray-400 w-48 rounded-md h-8"
            type="text"
            value={ local.email }
            onChange={changeValue('email')}
          />

          <label htmlFor="address">주소</label>
          <input
            id="address"
            className="border my-2 border-gray-400 px-2  w-48 rounded-md h-8"
            type="text"
            value={ local.address }
            onChange={changeValue('address')}
          />

          <label htmlFor="phone">연락처</label>
          <input
            id="phone"
            className="px-2  border my-2 h-8 border-gray-400 w-48 rounded-md"
            type="text"
            value={ local.phone }
            onChange={changeValue('phone')}
          />
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
            value={ local.careerYear + "년" }
            onChange={changeValue('careerYear')}
            />

          <span className="mt-5">포트폴리오 링크</span>
          <input
            type="text"
            className="px-2 mt-2 border border-subGreen2 w-72 h-10 rounded-xl"
            value={ local.portfolioURL }
            onChange={changeValue('portfolioURL')}
          />

          <span className="mt-5">한 줄 자기소개</span>
          <input
            type="text"
            className="px-2 mt-2 border border-subGreen2 w-72 h-10 rounded-xl"
            value={ local.selfIntroduction }
            onChange={changeValue('selfIntroduction')}
          />
        </div>
      <div className="flex justify-end mr-10 my-5">
        <DoneButton height={40} width={100} title="수정하기" />
      </div>
      </div>
    </form>
  )
}
export default UserInfo;
