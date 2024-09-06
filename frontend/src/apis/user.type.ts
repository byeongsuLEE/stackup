//== 프리랜서 회원가입 ==//
export interface freelanceSignupInfo {
  name: string,
  email: string,
  adress:string,
  phone: string,
  classification: string,
  framework: Array<string>,
  language: Array<string>,
  careerYear: number,
  portfolioURL: string,
  githubURL: string
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