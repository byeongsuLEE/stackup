import { create } from "zustand";

interface basicInfo {
    name: string;
    email: string;
    address: string;
    phone: string;
    setName: (name: string) => void;
    setEmail: (email: string) => void;
    setAddress: (address: string) => void;
    setPhone: (phone: string) => void;
}

export const freelanceBasicStore = create<basicInfo>((set) => ({
    name: "",
    email: "",
    address: "",
    phone: "",
    setName: (name) => set({ name }),
    setEmail: (email) => set({ email }),
    setAddress: (address) => set({ address }),
    setPhone: (phone) => set({ phone })
}));

interface languageInfo {
    classification: string;
    framework: string;
    language: string;
    careerYear: number;
    portfolioURL: string;
    selfIntroduction: string;
    setClassification: (classification: string) => void;
    setFramework: (framework: string) => void;
    setLanguage: (language: string) => void;
    setCareerYear: (careerYear: number) => void;
    setPortfolioURL: (portfolioURL: string) => void;
    setSelfIntroduction: (selfIntroduction: string) => void;
}

export const freelanceLanguageStore = create<languageInfo>((set) => ({
    classification: "",
    framework: "",
    language: "",
    careerYear: 0,
    portfolioURL: "",
    selfIntroduction: "",
    setClassification: (classification) => set({ classification }),
    setFramework: (framework) => set({ framework }),
    setLanguage: (language) => set({ language }),
    setCareerYear: (careerYear) => set({ careerYear }),
    setPortfolioURL: (portfolioURL) => set({ portfolioURL }),
    setSelfIntroduction: (selfIntroduction) => set({ selfIntroduction })
}))