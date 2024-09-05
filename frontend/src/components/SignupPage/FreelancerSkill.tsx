import Button from "../common/Button";

const SkillInsert = () => {
  return (
    <div>
      <form>
        <div className="bg-bgGreen flex flex-col w-[800px] h-[530px] border border-mainGreen ">
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold mt-10 mb-2 text-subGreen2">
              프리랜서로 시작하기
            </span>
            <span className="text-sm mb-10 text-subTxt">
              서비스 이용에 필요한 정보를 입력해주세요.
            </span>
          </div>
          <div className="flex flex-col ml-10">
            <span>대분류</span>
            <span>사용언어</span>
            <span>프레임워크</span>
            <span>경력</span>
            <span>포트폴리오 링크</span>
            <span>한 줄 자기소개</span>
          </div>
          
          <div className="flex justify-end mr-10 my-5">
            <Button height={40} width={100} title="저장" />
          </div>
        </div>
      </form>
    </div>
  );
};
export default SkillInsert;
