const DetailSide = () =>{
  return (
    <div className="w-[250px] h-[400px] p-5 bg-bgGreen border border-mainGreen rounded-lg mt-20 mr-10">
      <span>기업명</span>
      <div className="bg-subTxt mt-3 w-auto h-[1px] mx-2"></div>
      <div className="flex justify-center my-2">평점</div>
      <div className="bg-subTxt w-auto h-[1px] mx-2"></div>
      <div className="mt-3">리뷰</div>

    </div>
  )
}

export default DetailSide;