import { create } from "zustand"

interface userInfoProp {
    token: string | null,
    userId: string | null,
    userType: string | null,
    setToken: (token: string) => void,
    setUserId: (userId: string) => void,
    setUserType: (usertype: string) => void
}

export const userInfoStore = create<userInfoProp>((set) => ({
    token: null,
    userId: null,
    userType: null,

    setToken: (token) => set({ token }),
    setUserId: (userId) => set({ userId }),
    setUserType: (userType) => set({ userType })

}))