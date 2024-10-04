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
    frameworks: Pick<Framework, 'frameworkId'>[]; // 'frameworkId'만 사용
    languages: Pick<Language, 'languageId'>[];   // 'languageId'만 사용
    level: string;
}

//== project ==//
export interface project {
    boardId: string,
    title: string,
    description: string,
    level: string,
    classification: string,
    frameworks: Framework[],
    languages: Language[],
    deposit: string,
    startDate: Date,
    period: string,
    recruits: number,
    applicants: number,
    worktype: boolean,
    company: string,
    requirements: string | null,
    rate: number,
    is_charged: boolean,
    address: string,
    deadline: Date,
    upload: Date,
    client: clientInfo

}

const clientBasic = {
    accountKey: "0",
    businessName: "0",
    businessRegistrationNumber: "0",
    email: "0",
    id: "0",
    name: "0",
    phone: "0",
    reportedCount: "0",
    roles: "0",
    secondPassword: "0",
    totalScore: "0"
}

//== project 기본 값 ==//
export const projectBasic = {
    boardId: '',
    title: '',
    description: '',
    levels: 0,
    classification: '',
    frameworks: [],
    languages: [],
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
    upload: new Date(),
    client: clientBasic
}

//== 프로젝트 filter ==//
export interface projectFilterProp {
    classification: string | null;
    worktype: string | null;
    deposit: string | null;
}

//== client 정보 ==//
export interface clientInfo {
    accountKey: string,
    businessName: string,
    businessRegistrationNumber: string,
    email: string,
    id: string,
    name: string,
    phone: string,
    reportedCount: string,
    roles: string,
    secondPassword: string,
    totalScore: string
}

// framework와 language 각각의 타입 정의
export interface Framework {
    frameworkId: number;
    name: string;
}

export interface Language {
    languageId: number;
    name: string;
}

// 추천프로젝트 타입
export interface recommend {
    recommendId: string;
    title: string;
    description: string;
    deposit: number;
    classification: string;
    frameworks: Framework[];
    languages: Language[];
    level: string;
    boardId: number;
}


export interface projectApplicantProps {
    email: string;
    freelancerProjectId: number;
    id: number;
    isPassed: boolean;
    name: string;
    phone: string;
    portfolioUrl: string;
    reportedCount: number;
    totalScore: number;
}