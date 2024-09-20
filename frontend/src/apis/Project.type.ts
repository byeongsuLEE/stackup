//== 프로젝트 등록 ==//
export interface createProjectProp {
    title: string;
    description: string;
    recruits: string;
    deposit: string;
    startDate: Date;
    period: string;
    deadline: Date;
    workType: boolean;
    address: string;
    requirements: string;
    classification: string;
    frameworks: Array<string>;
    languages: Array<string>;
    levels: Array<string>;
}

//== project ==//
export interface project {
    boardId: string,
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

//== project 기본 값 ==//
export const projectBasic = {
    boardId: '',
    title: '',
    description: '',
    classification: '',
    framework: [],
    language: [],
    deposit: '',
    startDate: new Date(),
    period: '',
    recruits: 0,
    applicants: 0,
    worktype: false,
    company: '',
    requirements: '',
    rate: 0,
    is_charged: false,
    address: '',
    deadline: new Date(),
    upload: new Date()
}

//== 프로젝트 filter ==//
export interface projectFilterProp {
    classification: string | null;
    worktype: string | null;
    deposit: string | null;
}