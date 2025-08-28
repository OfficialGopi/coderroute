import jwt from "jsonwebtoken";
import { User } from "../models/client";
import { env } from "../../env";
import { db } from "../../db";

const sanitizeUser = (user: Partial<User>) => {
  delete user.refreshToken;
  return user;
};

const generateTokensAndSaveToDB = async (user: User) => {
  try {
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
  } catch (error) {
    return null;
  }
};

const decodeTokenAndExtractUser = async (
  token: string,
  type: "access" | "refresh" = "access"
) => {
  const secret =
    type === "access" ? env.ACCESS_TOKEN_SECRET : env.REFRESH_TOKEN_SECRET;

  const decodedToken = jwt.verify(token, secret) as {
    id?: string;
  } & jwt.JwtPayload;

  if (!decodedToken || !decodedToken.id) {
    return null;
  }

  if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
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
