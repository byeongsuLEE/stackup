import { useNavigate } from 'react-router-dom';
import DoneButton from '../components/common/DoneButton';
import ReccommnendWork from '../components/WorkPage/RecommendWork';
import WorkList from '../components/WorkPage/WorkList';

const Work = () => {
  const navigate = useNavigate();
  const toPostWork = () => {
    navigate('/work/post');
  }
  return (
    <div className='flex flex-col mx-40'>
      {/* 클라이언트 일감 페이지 */}
      <div onClick={toPostWork} className='my-10 flex justify-center'>
      <DoneButton width={200} height={32} title="프로젝트 등록하기" />
      </div>
      {/* 프리랜서 추천 일감 */}
      <ReccommnendWork/>
      <div className="bg-subTxt w-auto h-[1px] flex justify-center mx-10 my-10"></div>
      <WorkList />
    </div>
  )
}

export default Work;
