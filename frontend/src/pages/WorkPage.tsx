import { useNavigate } from 'react-router-dom';
import DoneButton from '../components/common/DoneButton';

const Work = () => {
  const navigate = useNavigate();
  const toPostWork = () => {
    navigate('/work/post');
  }
  return (
    <div className='flex justify-center'>
      {/* 클라이언트 일감 페이지 */}
      <div onClick={toPostWork} className='my-10'>
      <DoneButton width={200} height={32} title="프로젝트 등록하기" />
      </div>
    </div>
  )
}

export default Work;
