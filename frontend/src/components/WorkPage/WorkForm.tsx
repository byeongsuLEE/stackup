import { Dayjs } from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createProjectProp, Framework, Language } from '../../apis/Board.type';
import { createProject } from '../../apis/BoardApi';
import AIIcon from '../../icons/AIIcon';
import DBIcon from '../../icons/DBIcon';
import MobileIcon from '../../icons/MobileIcon';
import PublisherIcon from '../../icons/PublisherIcon';
import WebIcon from '../../icons/WebIcon';
import Major from '../SignupPage/Major';
import Skill from '../SignupPage/Skill';
import Button from '../common/DoneButton';
import BasicDatePicker from './Calender';
import JuniorIcon from '../../icons/JuniorIcon';
import MidIcon from '../../icons/MidIcon';
import SeniorIcon from '../../icons/Senior';
import axios from 'axios';
import { useState } from 'react';

const svURL = import.meta.env.VITE_SERVER_URL;

const WorkForm = () => {
  const { register, handleSubmit, control, setValue, watch } = useForm<createProjectProp>({
    defaultValues: { languages: [], frameworks: [] }
  });

  const navigate = useNavigate();

  //== 제출 ==//
  const onSubmit = (information: createProjectProp) => {
    createProject(information)

    navigate("/work");
  }

  //== 언어 선택 ==//
  const languageList = watch('languages');
  const choiceLanguage = (value: string) => {
    if (languageList.includes(value)) {
      setValue('languages', languageList.filter(item => item != value));
    } else {
      setValue('languages', [...languageList, value]);
    }
  };

  //== 프레임워크 선택 ==//
  const frameworkList = watch('frameworks')
  const choiceFramework = (value: string) => {

    if (frameworkList.includes(value)) {
      setValue('frameworks', frameworkList.filter(item => item != value));
    } else {
      setValue('frameworks', [...frameworkList, value]);
    }
  }

  // description을 상태로 관리
  const [description, setDescription] = useState('');

  // 버튼 클릭 시 POST 요청을 보내는 함수
  const getAi = async () => {
    if (!description) {
      alert('Description을 입력하세요.');
      return;
    }

    try {
      const res = await axios.post(`${svURL}/board/search`, {
        description: description, // description을 POST 요청의 body에 포함
      });

      // 선택된 값을 업데이트
      setValue("classification", res.data.classification);

      const languageIds: string[] = res.data.languages.map((language: Language) => language.languageId.toString())
      setValue("languages", languageIds);

      // res.data.frameworks에서 frameworkId만 추출하여 설정
      const frameworkIds: string[] = res.data.frameworks.map((framework: Framework) => framework.frameworkId.toString());
      setValue('frameworks', frameworkIds);

    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-bgGreen flex flex-col px-20 py-10 mt-10 w-[900px] h-auto border rounded-lg border-mainGreen ">
        <div className="flex">
          <div className="text-sm mr-5 text-subTxt">
            프로젝트 등록에 어려움이 있다면?
          </div>
            <div onClick={getAi}>
              <Button type="button" width={200} height={30} title="AI 프로젝트 등록" />
            </div>
        </div>

        <span className='text-sm text-subTxt mt-10'>[ 필수 입력사항 ]</span>
        <div className='flex mt-5'>
          <div className='flex flex-col mr-32'>
            <label htmlFor="title">프로젝트명</label>
            <label className='mt-4' htmlFor="description">프로젝트 설명</label>
            <label className="mt-40" htmlFor="recruits">모집 인원</label>
            <label className='mt-4' htmlFor="deposit">예상 금액</label>
            <label className='mt-5' htmlFor="projectStart">프로젝트 시작일</label>
            <label className='mt-5' htmlFor="period">프로젝트 기간</label>
            <label className='mt-5' htmlFor="deadline">공고 마감일</label>
            <label className='mt-5' htmlFor="workType">근무 형태</label>
            <label className='mt-5' htmlFor="address">실제 근무지</label>
            <label className='mt-5' htmlFor="requirements">기타 요구사항</label>
          </div>
          <div className='flex flex-col'>
            <input
              className='border border-slate-300 rounded-lg w-96 p-2'
              type="text"
              {...register("title", { required: '제목을 입력해주세요.' })}
            />

            <textarea
              className='py-2 px-2 border mt-3 border-slate-300 h-40 rounded-lg'
              {...register("description", {
                required: "설명을 입력해주세요.",
                onChange: (e) => {
                  setDescription(e.target.value);
                }
              })}
            />

            <input
              className='border mt-3 border-slate-300 rounded-lg w-96 text-end px-2'
              type="text"
              placeholder="명"
              {...register("recruits", { required: "모집 인원을 입력해주세요." })}
            />

            <input
              className='border border-slate-300 rounded-lg w-96 mt-3 text-end px-2'
              type="text" placeholder="만원"
              {...register("deposit", { required: "예상 금액을 입력해주세요." })}
            />

            <Controller
              name="startDate"
              control={control}
              rules={{ required: '날짜를 입력해주세요.' }}
              render={({ field: { onChange } }) => (
                <BasicDatePicker
                  onChange={(date: Dayjs | null) => {
                    onChange(date?.format('YYYY-MM-DD'));
                  }}
                />
              )}
            />

            <input
              className='border border-slate-300 rounded-lg w-96 mt-3 text-end px-2'
              type="text"
              placeholder="일"
              {...register("period", { required: "프로젝트 기간을 입력해주세요." })}
            />

            <Controller
              name="deadline"
              control={control}
              rules={{ required: '날짜를 입력해주세요.' }}
              render={({ field: { onChange } }) => (
                <BasicDatePicker
                  onChange={(date: Dayjs | null) => {
                    onChange(date?.format('YYYY-MM-DD'));
                  }}
                />
              )}
            />

            <select
              className='border border-slate-300 rounded-lg w-96 mt-3 text-end px-2'
              {...register("workType", { required: "근무형태를 입력해주세요." })}
            >
              <option value="true">재택</option>
              <option value="false">기간제 상주</option>
            </select>

            <input 
              className='border border-slate-300 rounded-lg w-96 mt-3 p-1'
              type="text"
              {...register("address", { required: "실제 근무지를 입력해주세요." })}
            />
            <input
              className='border border-slate-300 rounded-lg w-96 mt-3 p-1'
              type="text"
              {...register("requirements", { required: "기타 요구사항을 입력해주세요." })}
            />
          </div>
        </div>

        <div className="bg-slate-300 h-0.5 w-[700px] mt-10"></div>
        <span className='text-sm text-subTxt mt-10'>[ 기타 입력사항 ]</span>
        <div className="flex flex-col mt-5">
          <span>대분류</span>
          <Controller
            name="classification"
            control={control}
            render={({ field: { value, onChange } }) => (
              <div className="flex" onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}>
                <Major major={WebIcon} title="웹" category='classification' name="web" value="web" checked={value === "web"} onChange={onChange} />
                <Major major={MobileIcon} title="모바일" category='classification' name="mobile" value="mobile" checked={value === "mobile"} onChange={onChange} />
                <Major major={PublisherIcon} title="퍼블리셔" category='classification' name="publisher" value="publisher" checked={value === "publisher"} onChange={onChange} />
                <Major major={AIIcon} title="AI" category='classification' name="ai" value="ai" checked={value === "ai"} onChange={onChange} />
                <Major major={DBIcon} title="DB" category='classification' name="db" value="db" checked={value === "db"} onChange={onChange} />
              </div>
            )}
          />
          <span>프로젝트 레벨</span>
          <Controller
            name="level"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="flex">
                <Major category='level' major={JuniorIcon} title="주니어" name="junior" value="JUNIOR" checked={value === "JUNIOR"} onChange={() => onChange("JUNIOR")} />
                <Major category='level' major={MidIcon} title="미드" name="mid" value="MID" checked={value === "MID"} onChange={() => onChange("MID")} />
                <Major category='level' major={SeniorIcon} title="시니어" name="senior" value="SENIOR" checked={value === "SENIOR"} onChange={() => onChange("SENIOR")} />
              </div>
            )}
          />

          <span>사용언어 ( 중복선택 가능 )</span>
          <Controller
            name="languages"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div onChange={(e: React.ChangeEvent<HTMLInputElement>) => choiceLanguage(e.target.value)}>
                <div className="flex">
                  <Skill category="languages" name="python" title="Python" value='1' checked={value.includes("1")} onChange={onChange} />
                  <Skill category="languages" name="java" title="JAVA" value='2' checked={value.includes("2")} onChange={onChange} />
                  <Skill category="languages" name="c" title="C언어" value='3' checked={value.includes("3")} onChange={onChange} />
                  <Skill category="languages" name="c++" title="C++" value='4' checked={value.includes("4")} onChange={onChange} />
                  <Skill category="languages" name="php" title="PHP" value='5' checked={value.includes("5")} onChange={onChange} />
                </div>
                <div className="flex mb-5">
                  <Skill category="languages" name="typescript" title="Typescript" value='6' checked={value.includes("6")} onChange={onChange} />
                  <Skill category="languages" name="javascript" title="Javascript" value='7' checked={value.includes("7")} onChange={onChange} />
                  <Skill category="languages" name="etc1" title="기타" value='8' />
                </div>
              </div>
            )}
          />

          <span>프레임워크 및 라이브러리 ( 중복선택 가능 )</span>
          <Controller
            name="frameworks"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="flex" onChange={(e: React.ChangeEvent<HTMLInputElement>) => choiceFramework(e.target.value)}>
                <Skill
                  category="frameworks"
                  name="react"
                  title="React"
                  value="1"
                  checked={value.includes("1")} // React가 선택되었는지 확인
                  onChange={onChange}
                />
                <Skill
                  category="frameworks"
                  name="vue"
                  title="Vue"
                  value='2'
                  checked={value.includes('2')} // Vue가 선택되었는지 확인
                  onChange={onChange} // 선택 상태를 업데이트
                />
                <Skill
                  category="frameworks"
                  name="spring"
                  title="Spring"
                  value='3'
                  checked={value.includes('3')} // Spring이 선택되었는지 확인
                  onChange={onChange} // 선택 상태를 업데이트
                />
                <Skill
                  category="frameworks"
                  name="django"
                  title="Django"
                  value='4'
                  checked={value.includes('4')} // Django가 선택되었는지 확인
                  onChange={onChange} // 선택 상태를 업데이트
                />
                <Skill
                  category="frameworks"
                  name="etc"
                  title="기타"
                  value='5'
                  checked={value.includes('5')} // 기타가 선택되었는지 확인
                  onChange={onChange} // 선택 상태를 업데이트
                />
              </div>
            )}
          />

          <div className="flex justify-end mt-10">
            <Button height={40} width={100} title="등록하기" />
          </div>

        </div>
      </div>
    </form >

  )
}
export default WorkForm;
