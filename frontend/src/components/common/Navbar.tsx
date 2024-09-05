import { Link } from "react-router-dom";
import Logo from "../../icons/Logo";

const Navbar = () => {
  return (
    <>
   <header className="flex justify-between items-center h-12">
    <Link to="/">
    <Logo/>
    </Link>
    <div className="flex">
    <Link to="/work" className="mr-2">일감</Link>
    <Link to="/project" className="mr-2">프로젝트</Link>
    <Link to="/career" className="mr-2">경력관리</Link>
    <Link to="/account">계좌관리</Link>
    </div>
    <div className="flex">
    <Link to="/login" className="mr-2">로그인</Link>
    {/* <span className="mr-2">회원가입</span> */}
    <span className="mr-2">로그아웃</span>
    <Link to="/mypage" className="mr-2">마이페이지</Link>
    </div>
   </header>
    <hr />
   </>
  )
}

export default Navbar;