

const Work = () => {

    return (
        <div className="flex justify-center mt-10 ">

            <div className="flex px-10 justify-between items-center w-[1000px] h-[150px] bg-bgGreen border border-mainGreen rounded-lg">

                <div className="flex flex-col">
                    <span className="font-bold text-xl">{title}</span>
                    <span className="font-bold text-subTxt">{classification}</span>
                </div>

                <div className="flex items-center">
                    <div className="w-[2px] h-[120px] bg-mainGreen mr-10"></div>
                    <div className="flex flex-col">
                        {/* <span className='text-red-400'>마감 {remainDay}일전</span>
                        <span>지원자 {applicants}명/{recruits}명</span> */}
                        {/* <div className="flex mt-2 items-center justify-center bg-mainGreen rounded-lg w-[100px] h-[30px]">평점 {rate} 점</div> */}
                    </div>
                </div>

            </div>
        </div>

    )
}
export default Work;