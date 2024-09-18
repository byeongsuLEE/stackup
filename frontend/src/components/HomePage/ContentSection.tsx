import { Link } from "react-router-dom";

interface ContentSectionProps {
  color?: string;
  title: string;
  description: string;
  DescriptionIcon: React.ComponentType;
  WorkButton?: React.ComponentType<{ width: number; height: number; title: string; }>;
}

const ContentSection = ({
  title,
  description,
  color,
  WorkButton: WorkButton,
  DescriptionIcon: DescriptionIcon,
}: ContentSectionProps): JSX.Element => {
  return (
    <section
      className="content-section flex relative h-[100vh]  font-sans"
      data-scroll
    >
      {/* 배경 섹션 */}
      <figure
        className="figure sticky top-0 left-0 w-full h-screen overflow-hidden transition-transform duration-700 ease-out"
        data-scroll
      >
        <div
          style={{ backgroundColor: color }}
          className="block w-full h-full object-cover object-center ">
        </div>
      </figure>

      {/* 텍스트 콘텐츠 */}
      <div className="absolute top-52 left-10  grid grid-rows-2 text-[2.5vmin] transition-opacity duration-500 ease-out"
        data-scroll>
        <div className="flex items-center justify-between" >
          <header className="header flex flex-col max-w-[35em] mr-32">
            <div className="subheading text-xl font-semibold mb-2">{title}</div>
            <h2 className="heading text-[2.75em] font-bold" data-splitting>
              {description}
            </h2>
            <Link to="/work" className="mt-10">
              {WorkButton && <WorkButton width={250} height={50} title="프로젝트 추천 받기" />} {/* 조건부 렌더링 */}
            </Link>
          </header>
          <DescriptionIcon/>
        </div>
      </div>
    </section>
  );
};

export default ContentSection;