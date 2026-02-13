import { Response } from "express";
import { ApiResponse, ApiError } from "@takathon/shared/types";

export class ResponseHandler {
  static success<T>(res: Response, data: T, status = 200) {
    const response: ApiResponse<T> = {
      success: true,
      data,
    };
    return res.status(status).json(response);
  }

  static error(res: Response, code: string, message: string, status = 400, details?: Record<string, unknown>) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code,
        message,
        details,
      },
    };
    return res.status(status).json(response);
  }
}
