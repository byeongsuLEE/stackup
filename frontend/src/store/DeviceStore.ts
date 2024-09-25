import { create } from "zustand";

// 디바이스 상태 인터페이스 정의
interface DeviceStore {
  isMobile: boolean;
  isDesktop: boolean;
  setDeviceType: (width: number) => void;
}

// Zustand 스토어 생성
const useDeviceStore = create<DeviceStore>((set) => ({
  isMobile: typeof window !== "undefined" ? window.innerWidth <= 441 : false,
  isDesktop: typeof window !== "undefined" ? window.innerWidth > 441 : false,
  setDeviceType: (width: number) =>
    set({
      isMobile: width <= 441,
      isDesktop: width > 441,
    }),
}));

// 윈도우 리사이즈 이벤트를 통해 상태 업데이트
const updateDeviceType = (): (() => void) => {
  const setDeviceType = useDeviceStore.getState().setDeviceType;

  const handleResize = () => {
    setDeviceType(window.innerWidth);
  };

  // 이벤트 리스너 추가
  window.addEventListener("resize", handleResize);

  // 컴포넌트 언마운트 시 이벤트 리스너 제거
  return () => window.removeEventListener("resize", handleResize);
};

// 초기화 함수 호출 (앱이 시작될 때 한 번 호출)
updateDeviceType();

export default useDeviceStore;
