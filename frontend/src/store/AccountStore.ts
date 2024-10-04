import { create } from "zustand"

interface password {
    password: string;
    confirmPassword: string;
    checkoutPassword: boolean;
    setPassword: (password: string) => void;
    setConfirmPassword: (confirmPassword: string) => void;
    setCheckoutPassword: (checkPassword: boolean) => void;
}

export const passwordStore = create<password>((set) => ({
    password: "",
    confirmPassword: "",
    checkoutPassword: false,
    setPassword: (password) => set({ password }),
    setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
    setCheckoutPassword: (checkoutPassword) => set({ checkoutPassword })
}))