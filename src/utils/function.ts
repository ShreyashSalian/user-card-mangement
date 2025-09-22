import express from "express";
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
  successMesssage: string,
  data: any
) => {
  return res.send(statusCode).json({
    status,
    statusCode,
    successMesssage,
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
  return res.status(res.statusCode).json({
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
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};
