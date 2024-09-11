import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import ScrollOut from "scroll-out";
import Splitting from "splitting";
import "splitting/dist/splitting-cells.css";
import "splitting/dist/splitting.css";
import "../components/HomePage/styles.css";

// GSAP와 ScrollTrigger 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

const HomePage = (): JSX.Element => {
  useEffect(() => {
    // ScrollOut 초기화
    ScrollOut({
      cssProps: {
        visibleY: true,
        viewportY: true,
      },
    });

    // Splitting 초기화
    Splitting({ target: ".heading, .intro-heading" });

    // Intersection Observer 설정
    const figures = document.querySelectorAll<HTMLElement>(".figure");
    const options = {
      root: null,
      threshold: 0.1, // 뷰포트에 10% 이상 노출될 때 트리거
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view"); // 뷰포트에 진입하면 클래스 추가
        } else {
          entry.target.classList.remove("in-view"); // 뷰포트를 벗어나면 클래스 제거
        }
      });
    }, options);

    figures.forEach((figure) => {
      observer.observe(figure); // 각 이미지에 대해 옵저버 설정
    });

    // 텍스트 애니메이션 효과 설정
    const textElements = gsap.utils.toArray<HTMLElement>(".text");
    textElements.forEach((text) => {
      gsap.to(text, {
        backgroundSize: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: text,
          start: "center 80%",
          end: "center 20%",
          scrub: true,
        },
      });
    });

    // 클린업
    return () => {
      figures.forEach((figure) => {
        observer.unobserve(figure);
      });
    };
  }, []);

  return (
    <div className="w-full h-full">
      {/* 소개 섹션 */}
      <section className="intro-section flex flex-col items-center justify-center min-h-[70vh] text-center text-mainGreen">
        <h1
          className="intro-heading text-5xl font-bold -translate-y-32"
          data-splitting
        >
          STACK UP
        </h1>
        <p className="text-lg font-normal -translate-y-24">
          개발자 프리랜서를 위한 종합 금융 서비스.
        </p>
      </section>

      {/* 콘텐츠 섹션 반복 렌더링 */}
      {contentData.map((content, index) => (
        <ContentSection
          key={index}
          // imgSrc={content.imgSrc}
          title={content.title}
          description={content.description}
          paragraph={content.paragraph}
        />
      ))}
      {/* 추가된 텍스트 효과 섹션 */}
      <TextEffectSection />
      <br />
      <br />
      <br />
    </div>
  );
};

interface ContentSectionProps {
  imgSrc?: string;
  title: string;
  description: string;
  paragraph: string;
}

const ContentSection = ({
  // imgSrc,
  title,
  description,
  paragraph,
}: ContentSectionProps): JSX.Element => {
  return (
    <section
      className="content-section relative h-[150vh] w-full font-sans"
      data-scroll
    >
      {/* 이미지 섹션 */}
      <figure
        className="figure sticky top-0 left-0 w-full h-screen overflow-hidden transition-transform duration-700 ease-out"
        data-scroll
      >
        <div className="block w-full h-full object-cover object-center">

        </div>
        {/* <img
          src={imgSrc}
          alt="content"
          className="block w-full h-full object-cover object-center"
        /> */}
      </figure>

      {/* 텍스트 콘텐츠 */}
      <div
        className="content absolute top-0 left-0 w-full h-full max-w-[35em] grid grid-rows-2 text-white p-8 text-[2.5vmin] transition-opacity duration-500 ease-out"
        data-scroll
      >
        <header className="header flex flex-col justify-end">
          <div className="subheading text-xl font-semibold mb-2">{title}</div>
          <h2 className="heading text-[2.75em] font-bold" data-splitting>
            {description}
          </h2>
        </header>
        <p className="paragraph row-span-2 leading-[1.5]">{paragraph}</p>
      </div>
    </section>
  );
};

const TextEffectSection = () => (
  <div className="main mt-20 py-4">
    <h1 className="text text-element">
      프로젝트 매칭<article>최적의 일감 찾기</article>
    </h1>
    <h1 className="text text-element">
      스마트 계약<article>안전한 계약 관리</article>
    </h1>
    <h1 className="text text-element">
      AI 이상 거래 감지<article>안전한 거래 보장</article>
    </h1>
    <h1 className="text text-element">
      만족도 최상
      <article>
        <Link to="/login">로그인</Link>
      </article>
    </h1>
    <h1 className="text text-element">
      지금 시작하세요!
      <article>
        <Link to="/login">로그인</Link>
      </article>
    </h1>
  </div>
);

// 콘텐츠 데이터 배열
const contentData = [
  {
    // imgSrc: "assets/work.webp",
    title: "일감 매칭 및 성과 점수 제공",
    description:
      "프리랜서의 기술과 경험을 분석해 최적의 프로젝트를 매칭하고, 성과 기반 점수로 신뢰도를 평가합니다.",
    paragraph:
      "빠르고 정확한 매칭과 객관적인 성과 평가로 프리랜서에게 더 나은 기회를 제공합니다.",
  },
  {
    imgSrc: "assets/accounts.webp",
    title: "계좌 관리",
    description:
      "프리랜서의 금융 계좌를 통합 관리하고 거래 내역을 쉽게 조회할 수 있습니다.",
    paragraph:
      "계좌 관리, 잔액 확인, 자금 이체 기능으로 효율적인 재정 관리를 지원합니다.",
  },
  {
    imgSrc: "assets/frauddetection.webp",
    title: "이상 계약 감지",
    description:
      "AI 기반 모델로 비정상적인 거래를 실시간 감지해 사기와 부정 거래를 방지합니다.",
    paragraph:
      "안전한 거래 환경을 위해 비정상적인 활동을 실시간으로 감지하고 경고합니다.",
  },
  {
    imgSrc: "assets/nft.webp",
    title: "경력 증명서 발급",
    description:
      "블록체인을 통해 프리랜서의 프로젝트 이력을 신뢰할 수 있는 경력 증명서로 발급합니다.",
    paragraph:
      "스마트 계약으로 투명하고 안전하게 경력을 관리하고 인증받으세요.",
  },
  {
    imgSrc: "assets/contract.webp",
    title: "스마트 계약 관리",
    description:
      "블록체인 스마트 계약으로 프리랜서와 클라이언트 간의 안전한 계약을 관리합니다.",
    paragraph:
      "다중 서명으로 보안을 강화한 자동 계약 실행 시스템을 제공합니다.",
  },
  {
    imgSrc: "assets/blockchain.webp",
    title: "블록체인 + OAuth 2.0",
    description:
      "블록체인과 OAuth 2.0을 결합해 안전한 데이터 공유와 접근을 지원합니다.",
    paragraph:
      "데이터 무결성과 프라이버시를 보장하며, 안전한 인증과 권한 관리를 제공합니다.",
  },

];

export default HomePage;
