import { Router } from "express";
import { passport } from "../libs/passport.lib";
import { env } from "../../env";
import { getMe, loginOrSignup, logout } from "../controllers/auth.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);
//GOOGLE LOGIN FALLBACK
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${env.CLIENT_URL}/login`,
    session: false,
  }),
  loginOrSignup
);

router.get("/logout", authenticateUser, logout);
router.get("/me", authenticateUser, getMe);

export { router as authRouter };
