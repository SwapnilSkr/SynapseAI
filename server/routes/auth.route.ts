import { Router } from "express";
import {
  getUserInSession,
  loginUser,
  logoutUser,
  registerUser,
  resendVerificationEmail,
  verifyEmail,
} from "../controllers/auth.controller";
import { passport as googlePassport } from "../strategies/google.strategy";
import {
  passportLoginMiddleware,
  passportSignUpMiddleware,
} from "../middlewares/passportMiddleware";

const router = Router();

router.post("/register", passportSignUpMiddleware, registerUser);
router.post("/login", passportLoginMiddleware, loginUser);
router.post("/resend-verification-email", resendVerificationEmail);
router.get("/verify-email", verifyEmail);
router.get(
  "/google",
  googlePassport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);
router.get(
  "/google/callback",
  googlePassport.authenticate("google", {
    successRedirect: `${process.env.FRONT_END_URL}/login`,
    failureRedirect: "/login",
  })
);
router.get("/get-user-in-session", getUserInSession);
router.get("/logout", logoutUser);

export default router;
