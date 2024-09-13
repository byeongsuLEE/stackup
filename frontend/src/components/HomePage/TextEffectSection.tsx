import { Link } from "react-router-dom";

const TextEffectSection = () => (
  <div className="main mt-20 py-4">
    <span className="text text-[100px] text-element">
      프로젝트 추천<article>최적의 일감 찾기</article>
    </span>
    <h1 className="text text-[100px] text-element">
      스마트 계약<article>안전한 계약 관리</article>
    </h1>
    <h1 className="text text-element text-[100px]">
      AI 이상 거래 감지<article>안전한 거래 보장</article>
    </h1>
    <h1 className="text text-[100px] text-element">
      지금 시작하세요!
      <article>
        <Link to="/login">로그인</Link>
      </article>
    </h1>
  </div>
);

export default TextEffectSection;