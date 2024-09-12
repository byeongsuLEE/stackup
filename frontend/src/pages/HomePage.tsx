import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect } from "react";
import ScrollOut from "scroll-out";
import Splitting from "splitting";
import "splitting/dist/splitting-cells.css";
import "splitting/dist/splitting.css";
import ContentSection from "../components/HomePage/ContentSection";
import contentData from "../components/HomePage/Formdata";
import TextEffectSection from "../components/HomePage/TextEffectSection";
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
      {contentData.map((content, index) => (
        <ContentSection
          key={index}
          title={content.title}
          description={content.description}
          color={content.color}
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

export default HomePage;
