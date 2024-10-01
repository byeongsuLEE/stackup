import { Link } from "react-router-dom";
import Logo from "../../icons/Logo";
import { useLoginStore } from "../../store/UserStore";

const Navbar = () => {
  const {isLogin} = useLoginStore.getState();
  return (
    <>
      {/* 네비게이션 바를 fixed로 설정하고, 전체 너비를 유지하기 위해 container 클래스를 수정 */}
      <header className="fixed top-0 left-0 w-full pl-4 pr-8 bg-white z-50 shadow-md flex justify-between h-20 items-center text-sm">
        <Link to="/">
          <Logo />

        </Link>
        <div className="flex">
          <Link to="/work" className="mr-6">
            프로젝트 찾기
          </Link>
          <Link to="/project" className="mr-6">
            나의 프로젝트
          </Link>
          <Link to="/career" className="mr-6">
            경력관리
          </Link>
          <Link to="/account">계좌관리</Link>
        </div>
        <div className="flex">
          {isLogin ? (
            <span className="mr-6">로그아웃</span>
          ):(
          <Link to="/login" className="mr-6">
            로그인
          </Link>
          )
          }
          <Link to="/mypage">
            마이페이지
          </Link>
        </div>
      </header>
    </>
  );
};

export default Navbar;
