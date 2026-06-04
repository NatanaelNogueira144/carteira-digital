export default interface IRequestErrorsResponse {
    message: string;
    errors: {[key: string]: string};
}