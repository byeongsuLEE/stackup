const ReccommnendWork = () => {
  return (
    <div className="mx-10">
      <span className="text-start">님을 위한 추천 프로젝트</span>
      <div className="flex justify-between">
        <div className="flex flex-col bg-bgGreen mx-1 mt-3 w-[400px] h-[150px] border border-mainGreen rounded-xl px-5 py-5">
          <span className="font-bold text-lg mb-3">프로젝트명</span>
          <span className="my-1">예상 금액</span>
          <span className="my-1">사용언어 및 프레임워크</span>
        </div>
      </div>
      <div className="bg-subTxt w-auto h-[1px] flex justify-center my-10"></div>
    </div>
  );
};
export default ReccommnendWork;
