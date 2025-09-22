import express from "express";
import crypto from "crypto";
export function asyncHandler<
  P = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
>(
  fn: (
    req: express.Request<P, ResBody, ReqBody, ReqQuery>,
    res: express.Response<ResBody>,
    next: express.NextFunction
  ) => Promise<any>
) {
  return (
    req: express.Request<P, ResBody, ReqBody, ReqQuery>,
    res: express.Response<ResBody>,
    next: express.NextFunction
  ) => Promise.resolve(fn(req, res, next)).catch(next);
}

export const sendSuccess = (
  res: express.Response,
  status: number,
  statusCode: number,
  successMessage: string,
  data: any
) => {
  return res.status(statusCode).json({
    status,
    statusCode,
    successMessage,
    errorMessage: null,
    data,
  });
};

export const sendError = (
  res: express.Response,
  status: number,
  statusCode: number,
  errorMessage: string
) => {
  return res.status(statusCode).json({
    status,
    statusCode,
    successMessage: null,
    errorMessage,
    data: null,
  });
};

export const trimInput = (value: string) => {
  if (typeof value === "string") {
    value.trim();
  }
  return value;
};

export const capitalizeFirstLetter = (name: string) => {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase().trim();
};

// Node.js: secure random digits using crypto.randomBytes

export const secureRandomDigits = (length = 16) => {
  if (length <= 0) return "";
  // generate bytes and map each byte -> digit by taking byte % 10
  const bytes = crypto.randomBytes(length);
  const digits = [];
  for (let i = 0; i < length; i++) {
    // ensure first digit isn't 0 if you want non-leading-zero numbers:
    if (i === 0) {
      // map to 1-9
      digits.push(String((bytes[i] % 9) + 1));
    } else {
      digits.push(String(bytes[i] % 10));
    }
  }
  return digits.join("");
};
