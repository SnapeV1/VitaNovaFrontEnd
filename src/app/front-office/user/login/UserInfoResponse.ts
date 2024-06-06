export interface UserInfoResponse {
    idUser: number;
    username: string;
    role: string;
    email: string;
    token:string;
  }
  export interface ResetPasswordRequest {

    email: string;
    password:string;
    phone:string;
  }