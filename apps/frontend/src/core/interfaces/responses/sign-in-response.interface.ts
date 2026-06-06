import IBaseResponse from "./base-response.interface";

export default interface ISignInResponse extends IBaseResponse {
    accessToken: string;
}