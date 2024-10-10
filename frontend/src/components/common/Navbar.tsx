import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../icons/Logo";
import { useLoginStore } from "../../store/UserStore";
import DoneButton from "./DoneButton";
import { logout } from "../../apis/UserApi";

const Navbar = () => {
  const { isLogin, checkLogin } = useLoginStore();
  const freelancerId = sessionStorage.getItem('freelancerId');
  const navigate = useNavigate();
  const toMypage = () => {
    navigate(`/mypage/${freelancerId}`);
  }
  useEffect(() => {
    checkLogin();
  }, [checkLogin])

  const callLogout = () => {
    logout();
  }
  return (
    <>
      {/* 네비게이션 바를 fixed로 설정하고, 전체 너비를 유지하기 위해 container 클래스를 수정 */}
      <header className="fixed top-0 left-0 w-full pl-4 pr-8 bg-white z-50 shadow-md flex justify-between h-20 items-center text-sm">
        <Link to="/">
          <Logo />
        </Link>
        {isLogin &&
          <div className="flex">
            <Link to="/work" className="mr-6">
              프로젝트 찾기
            </Link>
            <Link to="/project" className="mr-6">
              나의 프로젝트
            </Link>
            {sessionStorage.getItem('userType') === 'client' ? (
              <>
              </>
            ) : (
              <Link to="/career" className="mr-6">
                경력관리
              </Link>
            )}
            <Link to="/account">계좌관리</Link>
          </div>
        }

        <div className="flex">
          {isLogin ? (
            <div className="flex items-center">
              <div onClick={callLogout} className="mr-3">
                <DoneButton width={90} height={30} title="로그아웃"/>
              </div>
              {sessionStorage.getItem('userType') === 'client' ? (
                <>
                </>
              ) : (
                <button onClick={toMypage}>
                  마이페이지
                </button>
                
              )}
            </div>
          ) : (
            <Link to="/login" className="mr-6">
              <DoneButton width={100} height={40} title="로그인"/>
            </Link>
          )
          }
        </div>
      </header>
    </>
  );
};

export default Navbar;