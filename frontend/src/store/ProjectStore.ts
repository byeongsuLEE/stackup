import { create } from "zustand";

interface projectFilterProp {
    classification: string | null,
    deposit: string | null,
    worktype: string | null,
    setClassification: (classification: string | null) => void,
    setDeposit: (deposit: string | null) => void,
    setWorktype: (worktype: string | null) => void
}

export const projectFilterStore = create<projectFilterProp>((set) => ({
    classification: null,
    deposit: null,
    worktype: null,
    setClassification: (classification) => set({ classification }),
    setDeposit: (deposit) => set({ deposit }),
    setWorktype: (worktype) => set({ worktype })
}))

interface project {
    id: string,
    title: string,
    description: string,
    classification: string,
    framework: string[],
    language: string[],
    deposit: string,
    startDate: Date,
    period: string,
    recruits: number,
    applicants: number,
    worktype: boolean,
    company: string,
    requirements: string,
    rate: number,
    is_charged: boolean,
    address: string,
    deadline: Date,
    upload: Date
}

interface projectList {
    projects: project[];
    setProjects: (projects: project[]) => void;
}

export const projectListStore = create<projectList>((set) => ({
    projects: [],
    setProjects: (projects) => set({ projects })
}))