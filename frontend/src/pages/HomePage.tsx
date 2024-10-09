import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect } from "react";
import ScrollOut from "scroll-out";
import Splitting from "splitting";
import "splitting/dist/splitting-cells.css";
import "splitting/dist/splitting.css";
import ContentSection from "../components/HomePage/ContentSection";
import TextEffectSection from "../components/HomePage/TextEffectSection";
import "../components/HomePage/styles.css";
import DoneButton from "../components/common/DoneButton";
import ContractIcon from "../icons/ContractIcon";
import DetectionIcon from "../icons/DetectionIcon";
import EvaluationIcon from "../icons/EvaluationIcon";
import RecommendIcon from "../icons/Recommend";
import WorkExample from "../icons/WorkExample";
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

    //클린업
    return () => {
      figures.forEach((figure) => {
        observer.unobserve(figure);
      });
    };
  }, []);

  return (
    <div>
      
          {/* 콘텐츠 섹션 반복 렌더링 */}

          <ContentSection
            title="프로젝트 추천"
            description="기술과 경험을 분석한 최적의 프로젝트 추천"
            color="rgb(251, 252, 248)"
            DescriptionIcon={WorkExample}
            WorkButton={DoneButton}
          />
          <ContentSection
            title="성과 기반 점수"
            description="성과 기반 점수로 서로의 신뢰도를 평가"
            DescriptionIcon={EvaluationIcon}
          />
          <ContentSection
            title="이상 계약 감지"
            description="AI 기반 모델로 비정상적인 거래 감지"
            color="rgb(251, 252, 248)"
            DescriptionIcon={DetectionIcon}
          />
          <ContentSection
            title="경력 증명서 발급"
            description="NFT 경력 증명서로 안전한 경력 관리"
            DescriptionIcon={RecommendIcon}
          />
          <ContentSection
            title="스마트 계약 관리"
            description="스마트 계약으로 프리랜서와 클라이언트의 안전한 계약 관리"
            color="rgb(251, 252, 248)"
            DescriptionIcon={ContractIcon}
          />

          {/* 추가된 텍스트 효과 섹션 */}
          <TextEffectSection />
          <br />
          <br />
          <br />
        </div>
        );
};

        export default HomePage;
