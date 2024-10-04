import { create } from "zustand"

interface password {
    password: string;
    confirmPassword: string;
    setPassword: (password: string) => void;
    setConfirmPassword: (confirmPassword: string) => void;
}

export const passwordStore = create<password>((set) => ({
    password: "",
    confirmPassword: "",
    setPassword: (password) => set({ password }),
    setConfirmPassword: (confirmPassword) => set({ confirmPassword })
}))