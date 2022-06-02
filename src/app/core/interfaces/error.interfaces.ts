import { CommonError } from "../enums";

export interface ErrorResponse<ErrorEnum> {
    status: 409;
    code: CommonError | ErrorEnum;
    message: string;
}

export interface HttpError<ErrorEnum> {
    error: ErrorResponse<ErrorEnum>
}
