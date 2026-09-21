import { AppError } from "./AppError.js";

export class ValidationError extends AppError {

    constructor(message = "Validation failed") {

        super(message, 400);

    }

}