import { create } from'zustand'

//로그인 상태 관리
interface LoginState {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
  checkLogin: () => void; // 세션에서 토큰 확인
}

export const useLoginStore = create<LoginState>((set) => ({
  isLogin: false,

  // 로그인 상태를 설정하는 함수
  setIsLogin: (isLogin: boolean) => set({ isLogin }),

  // 세션에 저장된 토큰을 확인하고 로그인 상태를 업데이트하는 함수
  checkLogin: () => {
    const token = sessionStorage.getItem('token');  // 세션에 저장된 토큰 확인
    set({ isLogin: !!token }); // token이 존재하면 true, 아니면 false
  },
  
}));


interface UserState {
  userType: string | null;
  freelancerId: string | null;
  clientId: string | null;
  token: string | null;
  setUserType: (userType: string) => void;
  setFreelancerId: (id: string) => void;
  setClientId: (id: string) => void;
  setToken: (token: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userType: window.sessionStorage.getItem("userType"),
  freelancerId: window.sessionStorage.getItem("freelancerId"),
  clientId: window.sessionStorage.getItem("clientId"),
  token: window.sessionStorage.getItem("token"),
  setUserType: (userType) => {
    window.sessionStorage.setItem("userType", userType);
    set({ userType });
  },
  setFreelancerId: (id) => {
    window.sessionStorage.setItem("freelancerId", id);
    set({ freelancerId: id });
  },
  setClientId: (id) => {
    window.sessionStorage.setItem("clientId", id);
    set({ clientId: id });
  },
  setToken: (token) => {
    window.sessionStorage.setItem("token", token);
    set({ token });
  },
  clearUser: () => {
    window.sessionStorage.removeItem("userType");
    window.sessionStorage.removeItem("freelancerId");
    window.sessionStorage.removeItem("clientId");
    window.sessionStorage.removeItem("token");
    set({ userType: null, freelancerId: null, clientId: null, token: null });
  },
}));
