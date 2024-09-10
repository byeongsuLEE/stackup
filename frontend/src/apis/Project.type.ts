//== 프로젝트 등록 ==//
export interface projectInformationProp {
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
    frameworks: string[];
    languages: string[];
}