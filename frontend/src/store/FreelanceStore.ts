import { create } from "zustand";

export interface freelanceInformation {
    name: string;
    email: string;
    address: string;
    level: string;
    phone: string;
    classification: string;
    frameworks: string[];
    languages: string[];
    careerYear: string;
    portfolioURL: string;
    selfIntroduction: string;
    totalScore: number;
    reportedCount: number;
    
    updateState: (newState: Partial<freelanceInformation>) => void;
    
    setName: (name: string) => void;
    setEmail: (email: string) => void;
    setAddress: (address: string) => void;
    setPhone: (phone: string) => void;
    setClassification: (classification: string) => void;
    setLevel: (level: string) => void;
    setFramworks: (framworks: string[]) => void;
    addFramework: (framework: string) => void;
    removeFramework: (framwork: string) => void;
    setLanguages: (languages: string[]) => void;
    addLanguage: (language: string) => void;
    removeLanguage: (language: string) => void;
    setCareerYear: (careerYear: string) => void;
    setPortfolioURL: (portfolioURL: string) => void;
    setSelfIntroduction: (selfIntroduction: string) => void;
    setTotalScore: (totalScore: number) => void;
    setReportedCount: (reportedCount: number) => void;
}

export const freelanceStore = create<freelanceInformation>((set) => ({
    name: "",
    email: "",
    address: "",
    phone: "",
    classification: "",
    level: "",
    frameworks: [],
    languages: [],
    careerYear: "",
    portfolioURL: "",
    selfIntroduction: "",
    totalScore: 0,
    reportedCount: 0,

    updateState: (newState)=> set((state) => ({...state, ...newState})),
    
    setName: (name) => set({ name }),
    setEmail: (email) => set({ email }),
    setAddress: (address) => set({ address }),
    setPhone: (phone) => set({ phone }),
    setClassification: (classification) => set({ classification }),
    setLevel: (level) => set({level}),
    setFramworks: (frameworks) => set({ frameworks }),
    addFramework: (framework) => set((state) => ({
        frameworks: [...state.frameworks, framework]
    })),
    removeFramework: (framework) => set((state) => ({
        frameworks: [...state.frameworks.filter(item => item !== framework), framework]
    })),
    setLanguages: (languages) => set({ languages }),
    addLanguage: (language) => set((state) => ({
        languages: [...state.languages, language]
    })),
    removeLanguage: (language) => set((state) => ({
        languages: [...state.languages.filter(item => item !== language), language]
    })),
    setCareerYear: (careerYear) => set({ careerYear }),
    setPortfolioURL: (portfolioURL) => set({ portfolioURL }),
    setSelfIntroduction: (selfIntroduction) => set({ selfIntroduction }),
    setTotalScore: (totalScore) => set({ totalScore }),
    setReportedCount: (reportedCount) => set({ reportedCount })
}));