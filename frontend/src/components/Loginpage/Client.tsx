const Client = () => {
  return (
    <form>
      <div className="flex flex-col mb-20 items-center justify-center w-96 h-96 rounded-lg bg-gray-100">
        <img className="h-28 mb-5" src="./logos/Stackup_Logo_Round.png" alt="GithubLogo" />
        <div className="flex flex-col" >
          <input className="border my-1 h-10 w-72 border-gray-300 rounded-xl" type="text" placeholder="ID" />
          <input className="border my-1 h-10 w-72 border-gray-300 rounded-xl" type="password" placeholder="PASSWORD" />
        </div>
        <button type="button" className="mt-10 theme-background-color font-bold rounded-2xl h-10 w-48 text-sm text-white ">로그인</button>
      </div>
    </form>
  )
}
export default Client;