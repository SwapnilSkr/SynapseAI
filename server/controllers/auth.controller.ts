import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { generateToken, PassportRequest } from "../utils/helpers";
import { CustomUser } from "../types/userTypes";
import { User } from "../models/user.model";
import registrationTemplate from "../email-templates/registration.template";
import mg from "../utils/mailgun";

export const registerUser = async (req: PassportRequest, res: Response) => {
  try {
    const user = req.creatorUser as CustomUser;
    const { passportInternalErr, passportAuthErr } = req;

    if (passportAuthErr || passportInternalErr) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Registration failed",
        error: passportAuthErr || passportInternalErr,
      });
    }

    const createdUser = await User.findById(user._id);
    if (!createdUser) {
      console.log("User not found", user._id);
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found",
      });
    }
    const { token, tokenExpires } = generateToken();
    createdUser.verificationToken = token;
    createdUser.verificationTokenExpires = tokenExpires;
    createdUser.save();

    const verificationLink = `${process.env.FRONT_END_URL}/verify-email?token=${token}`;
    const emailTemplate = registrationTemplate(verificationLink);

    mg.messages
      .create(process.env.MAILGUN_SANDBOX_DOMAIN as string, {
        from: process.env.VERIFIED_EMAIL,
        to: [user.email],
        subject: "Email Verification",
        text: "Verify your Email!",
        html: emailTemplate,
      })
      .then((msg) => console.log(msg))
      .catch((err) => console.error(err));

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

export const verifyEmail = async (req: PassportRequest, res: Response) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Token not found",
      });
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid or expired token",
      });
    }

    user.verified = true;
    user.verificationToken = "";
    user.verificationTokenExpires = undefined;
    await user.save();

    return res.status(StatusCodes.OK).json({
      message: "Email verified successfully",
    });
  } catch (error: any | unknown) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Email verification failed",
      error: error.message,
    });
  }
};

export const loginUser = async (req: PassportRequest, res: Response) => {
  try {
    const user = req.creatorUser as CustomUser;
    const { passportInternalErr, passportAuthErr } = req;

    if (passportAuthErr || passportInternalErr) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Authentication failed",
        error: passportAuthErr || passportInternalErr,
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
    const { creatorUser } = req;
    if (!creatorUser) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "failed",
        error: "No user found",
      });
    } else {
      return res.status(StatusCodes.OK).json({
        message: "success",
        user: creatorUser,
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
