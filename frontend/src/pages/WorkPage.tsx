import { useNavigate } from 'react-router-dom';
import RecommendList from '../components/WorkPage/RecommendList';
import WorkList from '../components/WorkPage/WorkList';
import DoneButton from '../components/common/DoneButton';

const Work = () => {
  const navigate = useNavigate();
  const toPostWork = () => {
    navigate('/work/post');
  }

  return (
    <div className='flex flex-col  mt-10'>
      {sessionStorage.getItem('userType') === 'client' ? (
        <div onClick={toPostWork} className='my-10 flex justify-center'>
          <DoneButton width={200} height={32} title="프로젝트 등록하기" />
        </div>
      ) : (
        <RecommendList />
      )}
      <div className="bg-subTxt w-auto h-[1px] flex justify-center my-10"></div>
      <WorkList />
    </div>
  )
}

export default Work;