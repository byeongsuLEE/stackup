import { create } from'zustand'

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
