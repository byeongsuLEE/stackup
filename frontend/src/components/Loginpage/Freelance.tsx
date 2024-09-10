import { freelanceLogin } from "../../apis/UserApi";

const Freelance = () => {
  return (
    <div className="flex flex-col mb-20 items-center justify-center w-96 h-96 rounded-lg bg-gray-100">
      {/* 프리랜서 로그인 */}
      <img
        className="h-28 mb-14"
        src="./logos/GithubLogo.png"
        alt="GithubLogo"
      />
      <button
        onClick={freelanceLogin}
        type="button"
        className="theme-background-color font-bold rounded-2xl h-10 w-48 text-sm text-white"
      >
        Github로 시작하기
      </button>
    </div>
  );
};
export default Freelance;
