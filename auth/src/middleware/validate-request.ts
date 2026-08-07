import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { RequestValidationError } from "../errors/request-validation-error.js";
import type { ZodObject } from "zod";

export const validateRequest = (schema: ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationResult = schema.safeParse(req.body);

    if (!validationResult.success) {
      throw new RequestValidationError(validationResult.error.issues);
    }

    next();
  };
};
