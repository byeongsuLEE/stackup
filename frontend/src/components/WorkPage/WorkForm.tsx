import { Dayjs } from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createProjectProp } from '../../apis/Project.type';
import { createProject } from '../../apis/ProjectApi';
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

const WorkForm = () => {
  const { register, handleSubmit, control, setValue, watch } = useForm<createProjectProp>({
    defaultValues: { languages: [], frameworks: [] }
  });

  const navigate = useNavigate();

  //== 제출 ==//
  const onSubmit = (information: createProjectProp) => {
    createProject(information)

    //== 나중에 수정하기 ==//
    navigate("/work");
  }

  //== 언어 선택 ==//
  const choiceLanguage = (value: string) => {
    const languageList = watch('languages')

    if (languageList.includes(value)) {
      setValue('languages', languageList.filter(item => item !== value));
    } else {
      setValue('languages', [...languageList, value]);
    }

  }

  //== 프레임워크 선택 ==//
  const choiceFramework = (value: string) => {
    const frameworkList = watch('frameworks')

    if (frameworkList.includes(value)) {
      setValue('frameworks', frameworkList.filter(item => item !== value));
    } else {
      setValue('frameworks', [...frameworkList, value]);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-bgGreen flex flex-col px-20 py-10 mt-10 w-[900px] h-auto border rounded-lg border-mainGreen ">
        <div className="flex items-center">
          <span className="text-sm mr-5 text-subTxt">
            프로젝트 등록에 어려움이 있다면?
          </span>
          <Button width={200} height={30} title="AI 프로젝트 등록" />
        </div>

        <span className='text-sm text-subTxt mt-10'>[ 필수 입력사항 ]</span>
        <div className='flex mt-5'>
          <div className='flex flex-col mr-32'>
            <label htmlFor="title">프로젝트명</label>
            <label className='mt-3' htmlFor="description">프로젝트 설명</label>
            <label className="mt-40" htmlFor="recruits">모집 인원</label>
            <label className='mt-3' htmlFor="deposit">예상 금액</label>
            <label className='mt-3' htmlFor="projectStart">프로젝트 시작일</label>
            <label className='mt-3' htmlFor="period">프로젝트 기간</label>
            <label className='mt-3' htmlFor="deadline">공고 마감일</label>
            <label className='mt-3' htmlFor="workType">근무 형태</label>
            <label className='mt-3' htmlFor="address">실제 근무지</label>
            <label className='mt-3' htmlFor="requirements">기타 요구사항</label>
          </div>
          <div className='flex flex-col'>
            <input
              // name="projectName"
              className='border border-slate-300 rounded-lg w-96'
              type="text"
              {...register("title", { required: '제목을 입력해주세요.' })}
            />

            <textarea
              // name='projectInfo'
              className='py-2 px-2 border mt-3 border-slate-300 h-40 rounded-lg'
              {...register("description", { required: "설명을 입력해주세요." })}
            />

            <input
              // name="projectPeople"
              className='border mt-3 border-slate-300 rounded-lg w-96 text-end px-2'
              type="text"
              placeholder="명"
              {...register("recruits", { required: "모집 인원을 입력해주세요." })}
            />

            <input
              // name='budget'
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
              // name='projectPeriod' 
              className='border border-slate-300 rounded-lg w-96 mt-3 text-end px-2'
              type="text"
              defaultValue="일"
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
              // name='workType' 
              className='border border-slate-300 rounded-lg w-96 mt-3 text-end px-2'
              {...register("workType", { required: "근무형태를 입력해주세요." })}
            >
              <option value="true">재택</option>
              <option value="false">기간제 상주</option>
            </select>

            <input
              // name='workAddress' 
              className='border border-slate-300 rounded-lg w-96 mt-3'
              type="text"
              {...register("address", { required: "실제 근무지를 입력해주세요." })}
            />
            <input
              // name='requirement' 
              className='border border-slate-300 rounded-lg w-96 mt-3'
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
            render={({ field: { onChange } }) => (
              <div className="flex" onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}>
                <Major major={WebIcon} title="웹" name="category" value="web" />
                <Major major={MobileIcon} title="모바일" name="category" value="mobile" />
                <Major major={PublisherIcon} title="퍼블리셔" name="category" value="publisher" />
                <Major major={AIIcon} title="AI" name="category" value="ai" />
                <Major major={DBIcon} title="DB" name="category" value="db" />
              </div>
            )}
          />
          <span>프로젝트 레벨</span>
          <Controller
            name="levels"
            control={control}
            render={({ field: { onChange } }) => (
              <div className="flex" onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}>
                <Major major={JuniorIcon} title="주니어" name="levels" value="junior" />
                <Major major={MidIcon} title="미드" name="levels" value="mid" />
                <Major major={SeniorIcon} title="시니어" name="levels" value="senior" />
              </div>
            )}
          />

          <span>사용언어 ( 중복선택 가능 )</span>
          <Controller
            name="languages"
            control={control}
            render={() => (
              <div onChange={(e: React.ChangeEvent<HTMLInputElement>) => choiceLanguage(e.target.value)}>
                <div className="flex">
                  <Skill category="languages" name="python" title="Python" value='1' />
                  <Skill category="languages" name="java" title="JAVA" value='2' />
                  <Skill category="languages" name="c" title="C언어" value='3' />
                  <Skill category="languages" name="c++" title="C++" value='4' />
                  <Skill category="languages" name="php" title="PHP" value='5' />
                </div>
                <div className="flex mb-5">
                  <Skill category="languages" name="typescript" title="Typescript" value='6' />
                  <Skill category="languages" name="javascript" title="Javascript" value='7' />
                  <Skill category="languages" name="etc1" title="기타" value='8' />
                </div>
              </div>
            )}
          />

          <span>프레임워크 ( 중복선택 가능 )</span>
          <Controller
            name="frameworks"
            control={control}
            render={() => (
              <div className="flex" onChange={(e: React.ChangeEvent<HTMLInputElement>) => choiceFramework(e.target.value)}>
                <Skill category="frameworks" name="react" title="React" value='1' />
                <Skill category="frameworks" name="vue" title="Vue" value='2' />
                <Skill category="frameworks" name="spring" title="Spring" value='3' />
                <Skill category="frameworks" name="django" title="Django" value='4' />
                <Skill category="frameworks" name="etc" title="기타" value='5' />
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
