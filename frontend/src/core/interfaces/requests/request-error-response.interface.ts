export default interface IRequestErrorsResponse {
    success: boolean;
    message: string;
    errors: {[key: string]: string};
}