import Button from "../common/Button";

const Information = () => {
  return (
    <form>
      <div className="bg-bgGreen flex flex-col w-[800px] h-[800px] border border-mainGreen ">
        <h1>클라이언트 시작하기</h1>
        <span>서비스 이용에 필요한 정보를 입력해주세요.</span>
        <label htmlFor="name" >이름</label>
        <input id="name" className="border my-2 border-gray-400 w-48 rounded-md" type="text"/>
        <label htmlFor="userId" >아이디</label>
        <input id="userId" placeholder="ssafy@ssafy.com" className="border my-2 border-gray-400 w-48 rounded-md" type="text"/>
        <label htmlFor="password" >비밀번호</label>
        <input id="password" className="border my-2 border-gray-400 w-48 rounded-md" type="password"/>
        <label htmlFor="passwordCheck" >이름</label>
        <input id="passwordCheck" className="border my-2 border-gray-400 w-48 rounded-md" type="password"/>
        <label htmlFor="businessNumber" >사업자 등록 번호</label>
        <input id="businessNumber" className="border my-2 border-gray-400 w-48 rounded-md" type="text"/>
        <label htmlFor="company" >기업명</label>
        <input id="company" className="border my-2 border-gray-400 w-48 rounded-md" type="text"/>
        <label htmlFor="phoneNumber" >연락처</label>
        <input id="phoneNumber" placeholder="010-1234-5678" className="border my-2 border-gray-400 w-48 rounded-md" type="text"/>     
        <Button height={40} width={100} title="회원가입"/>
      </div>
    </form>
  )
}
export default Information;