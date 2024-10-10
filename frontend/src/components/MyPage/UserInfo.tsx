import React, { useEffect, useState } from "react";
import { registerFreelancerInfo } from "../../apis/UserApi";
import AIIcon from "../../icons/AIIcon";
import DBIcon from "../../icons/DBIcon";
import MobileIcon from "../../icons/MobileIcon";
import PublisherIcon from "../../icons/PublisherIcon";
import WebIcon from "../../icons/WebIcon";
import { freelanceInformation } from "../../store/FreelanceStore";
import Major from "../SignupPage/Major";
import Skill from "../SignupPage/Skill";
import DoneButton from "../common/DoneButton";

const UserInfo = (data: freelanceInformation) => {
  const [local, setLocal] = useState({
    name: data.name || '',
    email: data.email || '',
    address: data.address || '',
    phone: data.phone || '',
    careerYear: data.careerYear || '',
    portfolioURL: data.portfolioURL || '',
    selfIntroduction: data.selfIntroduction || ''
  });

  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    setLocal({
      name: data.name || '',
      email: data.email || '',
      address: data.address || '',
      phone: data.phone || '',
      careerYear: data.careerYear || '',
      portfolioURL: data.portfolioURL || '',
      selfIntroduction: data.selfIntroduction || ''
    });
    // 세션 스토리지에서 userType 확인 후 freelancer면 readonly 설정
    const userType = window.sessionStorage.getItem('userType');
    if (userType == 'client') {
      setIsReadOnly(true);
    }
  }, [data]);

  const changeValue = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? (key === 'careerYear' ? Number(e.target.value) : e.target.value) : '';
    setLocal((prevValue) => ({
      ...prevValue,
      [key]: value || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    data.updateState(local);
    await registerFreelancerInfo();

  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-bgGreen flex flex-col mx-20 my-10 p-10 border border-mainGreen w-auto h-auto rounded-lg">
        <div className="flex flex-col ml-10">
          <label htmlFor="name">이름</label>
          <input
            id="name"
            className="border my-2 px-2 border-gray-400 w-48 h-8 rounded-md"
            type="text"
            value={local.name || ""}
            onChange={changeValue('name')}
            readOnly={isReadOnly}
          />

          <label htmlFor="email">이메일</label>
          <input
            id="email"
            className="border my-2 px-2 border-gray-400 w-48 rounded-md h-8"
            type="text"
            value={local.email || ""}
            onChange={changeValue('email')}
            readOnly={isReadOnly}
          />

          <label htmlFor="address">주소</label>
          <input
            id="address"
            className="border my-2 border-gray-400 px-2 w-48 rounded-md h-8"
            type="text"
            value={local.address || ""}
            onChange={changeValue('address')}
            readOnly={isReadOnly}
          />

          <label htmlFor="phone">연락처</label>
          <input
            id="phone"
            className="px-2 border my-2 h-8 border-gray-400 w-48 rounded-md"
            type="text"
            value={local.phone || ""}
            onChange={changeValue('phone')}
            readOnly={isReadOnly}
          />
        </div>

        <div className="flex flex-col ml-10">
          <span>대분류</span>
          <div className="flex">
            <Major major={WebIcon} category="classification" title="웹" name="category" value="web" />
            <Major major={MobileIcon} category="classification" title="모바일" name="category" value="mobile" />
            <Major major={PublisherIcon} category="classification" title="퍼블리셔" name="category" value="publisher" />
            <Major major={AIIcon} category="classification" title="AI" name="category" value="ai" />
            <Major major={DBIcon} category="classification" title="DB" name="category" value="db" />
          </div>

          <span>사용언어(중복선택 가능)</span>
          <div className="flex">
            <Skill category="languages" name="python" title="Python" value="Python" />
            <Skill category="languages" name="java" title="JAVA" value="JAVA" />
            <Skill category="languages" name="c" title="C언어" value="C" />
            <Skill category="languages" name="c++" title="C++" value="C++" />
            <Skill category="languages" name="php" title="PHP" value="PHP" />
          </div>
          <div className="flex mb-5">
            <Skill category="languages" name="typescript" title="Typescript" value="Typescript" />
            <Skill category="languages" name="javascript" title="Javascript" value="Javascript" />
            <Skill category="languages" name="etc1" title="기타" value="etc" />
          </div>

          <span>프레임워크(중복선택 가능)</span>
          <div className="flex">
            <Skill category="frameworks" name="react" title="React" value="React" />
            <Skill category="frameworks" name="vue" title="Vue" value="Vue" />
            <Skill category="frameworks" name="spring" title="Spring" value="Spring" />
            <Skill category="frameworks" name="django" title="Django" value="Django" />
            <Skill category="frameworks" name="etc" title="기타" value="etc" />
          </div>

          <span className="mt-5">경력</span>
          <input
            placeholder="년"
            className="mt-2 text-right px-2 border border-subGreen2 w-52 h-10 rounded-xl"
            type="text"
            value={local.careerYear ? `${local.careerYear}년` : ""}
            onChange={(e) => {
              // const value = e.target.value.replace(/[^0-9]/g, ""); // 숫자 외의 값 제거
              changeValue('careerYear')(e as React.ChangeEvent<HTMLInputElement>); // 상태 업데이트는 숫자만 처리
            }}
            readOnly={isReadOnly}
          />

          {window.sessionStorage.getItem('userType') === 'freelancer' &&
          <>
          <span className="mt-5">포트폴리오 링크</span>
          <input
            type="text"
            className="px-2 mt-2 border border-subGreen2 w-72 h-10 rounded-xl"
            value={local.portfolioURL || ""}
            onChange={changeValue('portfolioURL')}
            readOnly={isReadOnly}
          />

          <span className="mt-5">한 줄 자기소개</span>
          <input
            type="text"
            className="px-2 mt-2 border border-subGreen2 w-72 h-10 rounded-xl"
            value={local.selfIntroduction || ""}
            onChange={changeValue('selfIntroduction')}
            readOnly={isReadOnly}
          />
          </>
          }
        </div>
        {window.sessionStorage.getItem('userType') === 'freelancer' &&
          <div className="flex justify-end mr-10 my-5">
            <DoneButton height={40} width={100} title="수정하기" />
          </div>
        }
      </div>
    </form>
  );
};

export default UserInfo;
