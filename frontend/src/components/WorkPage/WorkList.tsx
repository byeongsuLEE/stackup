const WorkList = () => {
  return (
    <div className="flex flex-col items-center"> 
    <div className="flex px-10 justify-between items-center w-[1500px] h-[150px] bg-bgGreen border border-mainGreen rounded-lg">
      <div className="flex flex-col">
        <span>프로젝트 명</span>
        <span>프로젝트 기간</span>
        <span>예상 금액</span>
        <span>대분류</span>
      </div>
      <div className="flex items-center">
      <div className="w-[2px] h-[120px] bg-mainGreen mr-10"></div>
      <div className="flex flex-col">
        <span>마감 0일전</span>
        <span>지원자 0명/0명</span>
        <div>평점 4.8</div>
      </div>
      </div>
    </div>
     </div>
  )
}
export default WorkList;
