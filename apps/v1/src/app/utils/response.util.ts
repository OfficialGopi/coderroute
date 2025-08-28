import { Response } from "express";

class ApiError extends Error {
  public statusCode: number;
  public success: boolean;
  public errors: any[];
  public message: string;
  constructor(
    statusCode: number = 500,
    message: string = "Something went wrong",
    errors = [],
    stack: string | undefined = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      // ============ Error.captureStackTrace(this, this.constructor) is called to generate a stack trace automatically ================
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class ApiResponse {
  public statusCode: number;
  public data: any;
  public success: boolean;
  public message: string;

  constructor(
    statusCode: number = 200,
    data: any = undefined,
    message: string = "Success"
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  public send(res: Response) {
    return res.status(this.statusCode).json(this);
  }
}

export { ApiError, ApiResponse };
