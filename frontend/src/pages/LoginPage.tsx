
const Login = () => {
  return (
    <div className="flex flex-col items-center mt-10">
      <div className="flex items-center">
      <span className="">클라이언트</span>
      <input type="checkbox" className="toggle toggle-success" defaultChecked />
      <span>프리랜서</span>
      </div>
      <div className="flex flex-col items-center w-96 bg-gray-200">
      <img className="h-20" src="./logos/GithubLogo.png" alt="" />
      <button type="button" className="theme-background-color rounded-2xl h-10 w-48">Github 로그인</button>
      </div>
    </div>
  )
}

export default Login;