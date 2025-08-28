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

const decodeTokenAndExtractUser = async (token: string) => {
  const decodedToken = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as {
    id?: string;
  } & jwt.JwtPayload;

  if (!decodedToken || !decodedToken.id) {
    return null;
  }

  const user = await db.user.findUnique({
    where: {
      id: decodedToken.id,
    },
  });

  if (!user) {
    return null;
  }

  return user as User;
};

export { sanitizeUser, generateTokensAndSaveToDB, decodeTokenAndExtractUser };
