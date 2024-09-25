//== 프리랜서 회원가입 ==//
export interface freelanceSignupInfo {
  name: string,
  email: string,
  address:string,
  phone: string,
  classification: string,
  framework: string[],
  language: string[],
  careerYear: string,
  portfolioURL: string,
  githubURL: string,
  selfIntroduction: string
}

//== 클라이언트 회원가입 ==//
export interface clientSignupInfo {
    name: string,
    email: string,
    password: string,
    passwordCheck: string,
    businessRegistrationNumber: string,
    businessName: string,
    phone: string
  }

//== 클라이언트 로그인 ==//
export interface clientLoginInfo {
    email: string,
    password: string
}