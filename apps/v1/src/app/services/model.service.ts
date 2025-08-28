import jwt from "jsonwebtoken";
import { User } from "../models/client";
import { env } from "../../env";
import { db } from "../../db";

const sanitizeUser = (user: Partial<User>) => {
  delete user.refreshToken;
  return user;
};

const generateTokensAndSaveToDB = async (user: User) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
    },
    env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: env.ACCESS_TOKEN_EXPIRY,
    } as jwt.SignOptions
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: env.REFRESH_TOKEN_EXPIRY,
    } as jwt.SignOptions
  );

  const updatedUser = await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken,
    },
  });

  return {
    accessToken,
    refreshToken,
    user: sanitizeUser(updatedUser),
  };
};

export { sanitizeUser, generateTokensAndSaveToDB };
