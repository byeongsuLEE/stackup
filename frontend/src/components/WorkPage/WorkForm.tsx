
import WebIcon from '../../icons/WebIcon';
import Major from '../SignupPage/Major';
import Skill from '../SignupPage/Skill';
import Button from '../common/DoneButton';
import BasicDatePicker from './Calender';

const WorkForm = () => {
  return (
    <form>
      
      <div className="bg-bgGreen flex flex-col px-20 py-10 mt-10 w-[900px] h-auto border border-mainGreen ">
        <div className="flex items-center">
          <span className="text-sm mr-5 text-subTxt">
            프로젝트 등록에 어려움이 있다면?
          </span>
          <Button width={200} height={30} title="AI 프로젝트 등록" />
        </div>

        <span className='text-sm text-subTxt mt-10'>[ 필수 입력사항 ]</span>
        <div className='flex mt-5'>
          <div className='flex flex-col mr-32'>
            <label htmlFor="projectName">프로젝트명</label>
            <label className='mt-3' htmlFor="projectInfo">프로젝트 설명</label>
            <label className='mt-40' htmlFor="budget">예상 금액</label>
            <label className='mt-3' htmlFor="projectStart">프로젝트 시작일</label>
            <label className='mt-3' htmlFor="projectPeriod">프로젝트 기간</label>
            <label className='mt-3' htmlFor="postPeriod">공고 마감일</label>
            <label className='mt-3' htmlFor="workType">근무 형태</label>
            <label className='mt-3' htmlFor="workAddress">실제 근무지</label>
            <label className='mt-3' htmlFor="requirement">기타 요구사항</label>
          </div>
          <div className='flex flex-col'>
            <input name="projectName" className='border border-slate-300 rounded-lg w-96' type="text" />
            <textarea name='projectInfo' className='py-2 px-2 border mt-3 border-slate-300 h-40 rounded-lg' />
            <input name='budget' className='border border-slate-300 rounded-lg w-96 mt-3 text-end px-2' type="text" defaultValue="원" />
            {/* <input name='projectStart' className='border border-slate-300 rounded-lg w-96 mt-3' type="text" /> */}
            <BasicDatePicker/>
            <input name='projectPeriod' className='border border-slate-300 rounded-lg w-96 mt-3 text-end px-2' type="text" defaultValue="일" />
            <BasicDatePicker/>
            {/* <input name='postPeriod' className='border border-slate-300 rounded-lg w-96 mt-3' type="text" /> */}
            <select name='workType' className='border border-slate-300 rounded-lg w-96 mt-3 text-end px-2'>
              <option value="home">재택</option>
              <option value="commute">기간제 상주</option>
            </select>
            <input name='workAddress' className='border border-slate-300 rounded-lg w-96 mt-3' type="text" />
            <input name='requirement' className='border border-slate-300 rounded-lg w-96 mt-3' type="text" />
          </div>
        </div>

        <div className="bg-slate-300 h-0.5 w-[700px] mt-10"></div>
        <span className='text-sm text-subTxt mt-10'>[ 기타 입력사항 ]</span>
        <div className="flex flex-col mt-5">
          <span>대분류</span>
          <div className="flex">
            <Major major={WebIcon} title="웹" name="category" value='web' />
            <Major major={WebIcon} title="모바일" name="category" value='mobile' />
            <Major major={WebIcon} title="퍼블리셔" name="category" value='publisher' />
            <Major major={WebIcon} title="AI" name="category" value='ai' />
            <Major major={WebIcon} title="DB" name="category" value='db' />
          </div>

          <span>사용언어 ( 중복선택 가능 )</span>
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
          <span>프레임워크 ( 중복선택 가능 )</span>
          <div className="flex">
            <Skill name="react" title="React" value='react' />
            <Skill name="vue" title="Vue" value='vue' />
            <Skill name="spring" title="Spring" value='spring' />
            <Skill name="django" title="Django" value='django' />
            <Skill name="etc" title="기타" value='etc' />
          </div>
        </div>
        <div className="flex justify-end mt-10">
          <Button height={40} width={100} title="등록하기" />
        </div>

      </div>
    </form >

  )
}
export default WorkForm;
