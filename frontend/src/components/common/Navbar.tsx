import { Link } from "react-router-dom";
import Logo from "../../icons/Logo";

const Navbar = () => {
  return (
    <>
      {/* 네비게이션 바를 fixed로 설정하고, 전체 너비를 유지하기 위해 container 클래스를 수정 */}
      <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/">
            <Logo />
          </Link>
          <div className="flex">
            <Link to="/work" className="mr-6">
              일감
            </Link>
            <Link to="/project" className="mr-6">
              프로젝트
            </Link>
            <Link to="/career" className="mr-6">
              경력관리
            </Link>
            <Link to="/account">계좌관리</Link>
          </div>
          <div className="flex">
            <Link to="/login" className="mr-6">
              로그인
            </Link>
            <Link to="/signup" className="mr-6">
              회원가입
            </Link>
            <span className="mr-6">로그아웃</span>
            <Link to="/mypage" className="mr-6">
              마이페이지
            </Link>
          </div>
        </div>
        <hr />
      </header>
    </>
  );
};

export default Navbar;
