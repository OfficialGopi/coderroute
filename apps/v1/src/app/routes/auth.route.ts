import { Router } from "express";
import { passport } from "../libs/passport.lib";
import { env } from "../../env";
import { loginOrSignup } from "../controllers/auth.controller";

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

export { router as authRouter };
