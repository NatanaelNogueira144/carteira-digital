export default class APIError extends Error {
    _errors?: {[key: string]: string};

    constructor(
        message: string,
        errors?: {[key: string]: string}
    ) {
        super(message);
        this.name = "APIError";
        this._errors = errors;
    }

    getErrors() {
        return this._errors;
    }
}