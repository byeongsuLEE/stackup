import WorkForm from "../components/WorkPage/WorkForm";

const PostWork = () => {
  return (
    <div className="flex flex-col items-center my-10">
    <span className="text-xl font-bold">프로젝트 등록하기</span>
    <div className="bg-slate-300 h-[1px] w-[900px] mt-5"></div>
    <WorkForm />
    </div>
  )
}
export default PostWork;
