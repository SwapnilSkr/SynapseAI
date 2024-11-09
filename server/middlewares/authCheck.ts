import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { PassportRequest } from "../utils/helpers";

export const authCheckMiddleware = async (
  req: PassportRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;
    console.log(req.session);
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "failed",
        error: "You are not authenticated!",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "failed",
      error,
    });
  }
};
