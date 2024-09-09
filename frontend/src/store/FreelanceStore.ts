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
    frameworks: string[];
    languages: string[];
    careerYear: string;
    portfolioURL: string;
    selfIntroduction: string;
    setClassification: (classification: string) => void;
    addFramework: (framework: string) => void;
    removeFramework: (framwork: string) => void;
    addLanguage: (language: string) => void;
    removeLanguage: (language: string) => void;
    setCareerYear: (careerYear: string) => void;
    setPortfolioURL: (portfolioURL: string) => void;
    setSelfIntroduction: (selfIntroduction: string) => void;
}

export const freelanceLanguageStore = create<languageInfo>((set) => ({
    classification: "",
    frameworks: [],
    languages: [],
    careerYear: "",
    portfolioURL: "",
    selfIntroduction: "",
    setClassification: (classification) => set({ classification }),
    addFramework: (framework) => set((state) => ({
        frameworks: [...state.frameworks, framework]
    })),
    removeFramework: (framework) => set((state) => ({
        frameworks: [...state.frameworks.filter(item => item !== framework), framework]
    })),
    addLanguage: (language) => set((state) => ({
        languages: [...state.languages, language]
    })),
    removeLanguage: (language) => set((state) => ({
        languages: [...state.languages.filter(item => item !== language), language]
    })),
    setCareerYear: (careerYear) => set({ careerYear }),
    setPortfolioURL: (portfolioURL) => set({ portfolioURL }),
    setSelfIntroduction: (selfIntroduction) => set({ selfIntroduction })
}))