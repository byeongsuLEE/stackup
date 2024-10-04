import Group from "../components/ProjectGroupPage/Group";

const ProjectGroup = () => {
  return (
    <>
    <span className="font-bold text-subGreen1 mx-10 text-lg">계약 관리</span>
      <div className="bg-subTxt w-auto h-[1px] flex justify-center my-5"></div>
        <div className="mx-40">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th className="p-0 pl-10 py-3">이름</th>
          </tr>
        </thead>
        <tbody>
          <Group name="이호영" />
        </tbody>
      </table>
    </div>
    </>
  )
}
export default ProjectGroup;