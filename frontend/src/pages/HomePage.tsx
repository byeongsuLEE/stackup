// 스크롤 -> 색상 변경 및 부드러운 스크롤 효과
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import LocomotiveScroll from "locomotive-scroll";

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<LocomotiveScroll | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    scrollerRef.current = new LocomotiveScroll({
      el: containerRef.current,
      smooth: true,
      // 스크롤 속도를 증가시키기 위해 multiplier를 높게 설정합니다.
      multiplier: 0.4, // 기본값은 1, 더 높은 값을 설정하여 스크롤 속도를 증가시킵니다.
      // lerp 값을 낮춰 더 부드러운 스크롤 효과를 만듭니다.
      lerp: 0.01, // 기본값은 0.1, 더 낮은 값은 더 부드러운 감쇠 효과를 제공합니다.
      class: "is-revealed", // 섹션이 보일 때 적용할 클래스
    });

    const locoScroll = scrollerRef.current;

    locoScroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(".container", {
      scrollTop(value) {
        if (arguments.length && locoScroll) {
          (locoScroll as any).scrollTo(value, {
            duration: 0,
            disableLerp: true,
          });
        }
        return locoScroll ? (locoScroll as any).scroll.instance.scroll.y : 0;
      },
      getBoundingClientRect() {
        return {
          left: 0,
          top: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    const handleRefresh = () => {
      if (locoScroll) {
        locoScroll.update();
      }
    };

    ScrollTrigger.addEventListener("refresh", handleRefresh);
    ScrollTrigger.refresh();

    const scrollColorElems = document.querySelectorAll("[data-bgcolor]");
    scrollColorElems.forEach((colorSection, i) => {
      const prevBg =
        i === 0 ? "" : (scrollColorElems[i - 1] as HTMLElement).dataset.bgcolor;
      const prevText =
        i === 0
          ? ""
          : (scrollColorElems[i - 1] as HTMLElement).dataset.textcolor;

      ScrollTrigger.create({
        trigger: colorSection,
        scroller: ".container",
        start: "top 50%",
        onEnter: () =>
          gsap.to("body", {
            backgroundColor: (colorSection as HTMLElement).dataset.bgcolor,
            color: (colorSection as HTMLElement).dataset.textcolor,
            overwrite: "auto",
          }),
        onLeaveBack: () =>
          gsap.to("body", {
            backgroundColor: prevBg,
            color: prevText,
            overwrite: "auto",
          }),
      });
    });

    return () => {
      if (locoScroll) {
        ScrollTrigger.getAll().forEach((st) => st.kill());
        locoScroll.destroy();
      }
      ScrollTrigger.removeEventListener("refresh", handleRefresh);
    };
  }, []);

  return (
    <div className="font-sans text-[var(--text-color)] bg-[var(--bg-color)] transition-all duration-300 ease-out overflow-x-hidden">
      <div ref={containerRef} className="container">
        <section
          data-bgcolor="#bcb8ad"
          data-textcolor="#032f35"
          className="min-h-screen w-full relative grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8 p-[50px_10vw] max-w-[1000px] mx-auto place-items-center"
        >
          <h1
            data-scroll
            data-scroll-speed="3"
            className="flex text-4xl md:text-6xl z-10 leading-tight font-bold"
          >
            Change background colour with GSAP ScrollTrigger
          </h1>
          <img
            src="https://images.pexels.com/photos/3062948/pexels-photo-3062948.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            alt="placeholder"
            className="max-h-[80vh] w-full object-contain absolute"
          />
        </section>
        <section
          data-bgcolor="#eacbd1"
          data-textcolor="#536fae"
          className="min-h-screen w-full relative grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8 p-[50px_10vw] max-w-[1000px] mx-auto place-items-center"
        >
          <img
            src="https://images.pexels.com/photos/4467879/pexels-photo-4467879.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            alt="placeholder"
            className="max-h-[80vh] w-full object-contain"
          />
          <h2
            data-scroll
            data-scroll-speed="1"
            className="text-2xl max-w-[400px]"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </h2>
        </section>
        <section
          data-bgcolor="#536fae"
          data-textcolor="#eacbd1"
          className="min-h-screen w-full relative grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8 p-[50px_10vw] max-w-[1000px] mx-auto place-items-center"
        >
          <img
            src="https://images.pexels.com/photos/5604966/pexels-photo-5604966.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            alt="placeholder"
            className="max-h-[80vh] w-full object-contain"
          />
          <h2
            data-scroll
            data-scroll-speed="1"
            className="text-2xl max-w-[400px]"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </h2>
        </section>
        <section
          data-bgcolor="#e3857a"
          data-textcolor="#f1dba7"
          className="min-h-screen w-full relative grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8 p-[50px_10vw] max-w-[1000px] mx-auto place-items-center"
        >
          <img
            src="https://images.pexels.com/photos/4791474/pexels-photo-4791474.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            alt="placeholder"
            className="max-h-[80vh] w-full object-contain"
          />
          <h2
            data-scroll
            data-scroll-speed="1"
            className="text-2xl max-w-[400px]"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </h2>
        </section>
      </div>
      <div className="fixed bottom-4 right-4">
        <a
          href=""
          target="_blank"
          rel="noopener noreferrer"
          className="text-white"
        >
          Made by Advantage
        </a>
      </div>
    </div>
  );
};

export default HomePage;
