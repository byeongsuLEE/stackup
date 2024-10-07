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