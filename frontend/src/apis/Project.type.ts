//== 프로젝트 등록 ==//
export interface createProjectProp {
    title: string;
    description: string;
    recruits: string;
    deposit: string;
    startDate: Date;
    period: string;
    deadline: Date;
    workType: Boolean;
    address: string;
    requirements: string;
    classification: string;
    frameworks: Array<string>;
    languages: Array<string>;
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

//== 프로젝트 filter ==//
export interface projectFilterProp {
    classification: string | null;
    worktype: string | null;
    deposit: string | null;
}