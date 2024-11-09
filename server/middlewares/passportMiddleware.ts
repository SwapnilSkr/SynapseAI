import { NextFunction, Response } from "express";
import { passport } from "../strategies/local.strategy";
import { PassportRequest } from "../utils/helpers";

export const passportLoginMiddleware = async (
  req: PassportRequest,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "local-login",
    (err: Error | null, user: Express.User | false | null, info: any) => {
      if (err) {
        req.passportInternalErr = err;
        return next();
      }
      if (!user) {
        req.passportauthErr = info.message;
        return next();
      }

      req.user = user;

      req.login(user, (loginErr) => {
        if (loginErr) {
          req.passportInternalErr = loginErr;
          return next();
        }
        return next();
      });
    }
  )(req, res, next);
};

export const passportSignUpMiddleware = async (
  req: PassportRequest,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "local-signup",
    (err: Error | null, user: Express.User | false | null, info: any) => {
      if (err) {
        req.passportInternalErr = err;
        return next();
      }
      if (!user) {
        req.passportauthErr = info.message;
        return next();
      }

      req.user = user;

      req.login(user, (loginErr) => {
        if (loginErr) {
          req.passportInternalErr = loginErr;
          return next();
        }
        return next();
      });
    }
  )(req, res, next);
};
