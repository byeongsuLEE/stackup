import WebIcon from "../../icons/WebIcon";

interface ContentSectionProps {
  color?: string;
  title: string;
  description: string;
}

const ContentSection = ({
  title,
  description,
  color,
}: ContentSectionProps): JSX.Element => {
  return (
    <section
      className="content-section flex relative h-[150vh]  font-sans"
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
      <div className="absolute w-full pr-[300px] h-full grid grid-rows-2  text-[2.5vmin] transition-opacity duration-500 ease-out"
        data-scroll>
      <div className="flex items-end justify-between" >
        <header className="header flex flex-col max-w-[35em]">
          <div className="subheading text-xl font-semibold mb-2">{title}</div>
          <h2 className="heading text-[2.75em] font-bold" data-splitting>
            {description}
          </h2>
        </header>
        <WebIcon h={50} w={50}/>
      </div>

      </div>
    </section>
  );
};

export default ContentSection;