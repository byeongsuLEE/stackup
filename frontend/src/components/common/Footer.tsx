import React, { useEffect, useState } from "react";
import { FaGithub, FaGitlab } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../icons/Logo";

interface IconItem {
  icon: JSX.Element;
  url: string;
  name: string;
}

interface MenuItem {
  text: string;
  path: string;
}

const Footer: React.FC = () => {
  const [hiddenFooter, setHiddenFooter] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname.match("/work") ||
      location.pathname.match("/project") ||
      location.pathname.match("/account") ||
      location.pathname.match("/career") ||
      location.pathname.match("/mypage") ||
      location.pathname.match("/login")
    ) {
      setHiddenFooter(true);
    } else {
      setHiddenFooter(false);
    }
  }, [location]);

  if (hiddenFooter) return null;

  const iconsTab: IconItem[] = [
    {
      icon: <FaGithub />,
      url: "",
      name: "이채연",
    },
    {
      icon: <FaGithub />,
      url: "",
      name: "이호영",
    },
    {
      icon: <FaGithub />,
      url: "https://github.com/wjswlgnsdlqslek",
      name: "전지훈",
    },
    {
      icon: <FaGithub />,
      url: "",
      name: "김연지",
    },
    {
      icon: <FaGithub />,
      url: "https://github.com/byeongsuLEE",
      name: "이병수",
    },
    {
      icon: <FaGithub />,
      url: "https://github.com/S-Choi-1997",
      name: "최승호",
    },
    {
      icon: <FaGitlab />,
      url: "https://lab.ssafy.com/s11-fintech-finance-sub1/S11P21C103",
      name: "C103",
    },
  ];

  const menuItems: MenuItem[] = [
    { text: "일감", path: "/work" },
    { text: "프로젝트", path: "/project" },
    { text: "경력관리", path: "/career" },
    { text: "계좌관리", path: "/account" },
  ];

  return (
    <footer
      className="bg-white mt-auto hidden md:block"
      style={{ fontFamily: "'IBM Plex Sans KR', sans-serif" }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-start">
        {/* 로고 및 아이콘 섹션 */}
        <div className="flex flex-col w-1/3 gap-4">
          <div className="flex gap-2">
            {/* <img src="/logos/Logo.png" alt="footer_logo" className="w-8" /> */}
            {/* <p className="font-semibold text-subGreen1">STACK UP</p> */}
            <Logo />
          </div>
          <div className="flex gap-2 text-black flex-wrap">
            {iconsTab.map(({ icon, url, name }, index) => (
              <div key={index} className="flex flex-col items-center">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-lg bg-gray-200 p-1.5 rounded-full hover:bg-mainGreen hover:text-white transition-all duration-300 cursor-pointer mb-1"
                >
                  {icon}
                </a>
                <span className="text-xs text-boldTxt">{name}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-boldTxt">© C103 STACKUP</p>
        </div>

        {/* 메뉴 및 팀 섹션 */}
        <div className="flex gap-10 w-2/3 justify-end">
          <div className="flex flex-col gap-2">
            <p className="text-lg font-bold">Menu</p>
            <span className="block w-16 h-0.5 bg-subGreen1"></span>
            {menuItems.map(({ text, path }, index) => (
              <Link
                key={index}
                to={path}
                className="text-sm font-medium text-boldTxt hover:text-subGreen1 cursor-pointer"
              >
                {text}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-lg font-bold">Team</p>
            <span className="block w-40 h-0.5 bg-subGreen1"></span>
            <div className="flex gap-6">
              <div className="flex flex-col">
                <p className="text-sm text-boldTxt font-bold">Front-end:</p>
                {["이채연", "이호영", "전지훈"].map((name, index) => (
                  <p key={index} className="text-xs text-boldTxt">
                    {name}
                  </p>
                ))}
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-boldTxt font-bold">Back-end:</p>
                {["김연지", "이병수", "최승호"].map((name, index) => (
                  <p key={index} className="text-xs text-boldTxt">
                    {name}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
