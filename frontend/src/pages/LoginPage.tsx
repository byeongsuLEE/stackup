
const Login = () => {
  return (
    <div className="flex flex-col items-center mt-10">
      <div className="flex items-center my-5">
        <span className="">클라이언트</span>
        <input type="checkbox" className="toggle toggle-success" defaultChecked />
        <span>프리랜서</span>
      </div>
      <div className="flex flex-col mb-20 items-center justify-center w-96 h-96 rounded-lg bg-gray-100">
        {/* 프리랜서 로그인 */}
        <img className="h-28 mb-14" src="./logos/GithubLogo.png" alt="GithubLogo" />
        <button type="button" className="theme-background-color font-bold rounded-2xl h-10 w-48 text-sm text-white">Github로 시작하기</button>
      </div>

      {/* 클라이언트 로그인 */}
      <form>
        <div className="flex flex-col mb-20 items-center justify-center w-96 h-96 rounded-lg bg-gray-100">
          <img className="h-28 mb-14" src="./logos/Stackup_Logo_Round.png" alt="GithubLogo" />
          <div className="flex flex-col" >
            <input className="border h-10 w-72 border-gray-300 rounded-xl" type="text" placeholder="ID" />
            <input className="border h-10 w-72 border-gray-300 rounded-xl" type="password" placeholder="PASSWORD" />
          </div>
          <button type="button" className="theme-background-color font-bold rounded-2xl h-10 w-48 text-sm text-white ">로그인</button>
        </div>
      </form>
    </div>
  )
}

export default Login;