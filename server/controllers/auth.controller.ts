import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { PassportRequest } from "../utils/helpers";
import { CustomUser } from "../types/userTypes";

export const registerUser = async (req: PassportRequest, res: Response) => {
  try {
    const user = req.user as CustomUser;
    const { passportInternalErr, passportauthErr } = req;

    if (passportauthErr || passportInternalErr) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Registration failed",
        error: passportauthErr || passportInternalErr,
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "success",
      user: { id: user._id, email: user.email },
    });
  } catch (error: any | unknown) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Sign Up failed",
      error: error.message,
    });
  }
};

export const loginUser = async (req: PassportRequest, res: Response) => {
  try {
    const user = req.user as CustomUser;
    const { passportInternalErr, passportauthErr } = req;

    if (passportauthErr || passportInternalErr) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Authentication failed",
        error: passportauthErr || passportInternalErr,
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "success",
      user: { id: user._id, email: user.email },
    });
  } catch (error: any | unknown) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

export const getUserInSession = async (req: PassportRequest, res: Response) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "failed",
        error: "No user found",
      });
    } else {
      return res.status(StatusCodes.OK).json({
        message: "success",
        user,
      });
    }
  } catch (error: any | unknown) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

export const logoutUser = (req: PassportRequest, res: Response) => {
  console.log("user", req.user);
  if (!req.user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      err: "No user in session",
    });
  }
  req.logout((err) => {
    if (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });
};
