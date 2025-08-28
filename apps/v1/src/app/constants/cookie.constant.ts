import { CookieOptions } from "express";
import { env } from "../../env";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
};

const tokenFieldNames = {
  accessToken: "access-token",
  refreshToken: "refresh-token",
};

export { cookieOptions, tokenFieldNames };
