import { db } from "../../db";
import { cookieOptions, tokenFieldNames } from "../constants/cookie.constant";
import { User } from "../models/client";
import { generateTokensAndSaveToDB } from "../services/model.service";
import { AsyncHandler } from "../utils/async-handler.util";
import { ApiError, ApiResponse } from "../utils/response.util";

const loginOrSignup = AsyncHandler(async (req, res) => {
  const user = req.user as User;

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastLogin = user.lastLogin || new Date(0);
  const lastLoginDate = new Date(lastLogin);

  // Format dates to compare just the date part (not time)
  const isYesterday =
    lastLoginDate.getFullYear() === yesterday.getFullYear() &&
    lastLoginDate.getMonth() === yesterday.getMonth() &&
    lastLoginDate.getDate() === yesterday.getDate();

  // Format today for comparison
  const isSameDay =
    lastLoginDate.getFullYear() === today.getFullYear() &&
    lastLoginDate.getMonth() === today.getMonth() &&
    lastLoginDate.getDate() === today.getDate();

  let streakCount = user.streakCount || 0;
  let maxStreakCount = user.maxStreakCount || 0;

  if (isYesterday) {
    // Continued streak
    streakCount += 1;
  } else if (!isSameDay) {
    // Streak broken, unless this is the first login of today
    streakCount = 1;
  }

  // Update max streak if current streak is higher
  maxStreakCount = Math.max(streakCount, maxStreakCount);

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      lastLogin: today,
      streakCount,
      maxStreakCount,
    },
  });

  const tokens = await generateTokensAndSaveToDB(user);

  res.cookie(tokenFieldNames.accessToken, tokens.accessToken, cookieOptions);
  res.cookie(tokenFieldNames.refreshToken, tokens.refreshToken, cookieOptions);

  return new ApiResponse(
    200,
    {
      user: tokens.user,
    },
    "Login successful"
  ).send(res);
});

export const logout = AsyncHandler(async (req, res) => {
  const user = req.user as User;

  res.clearCookie(tokenFieldNames.accessToken, cookieOptions);
  res.clearCookie(tokenFieldNames.refreshToken, cookieOptions);
  if (!user) {
    new ApiResponse(200, undefined, "Logout successful");
  }

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken: null,
    },
  });

  new ApiResponse(200, undefined, "Logout successful");
});

export const getMe = AsyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "User not found");
  }

  return new ApiResponse(200, {
    user,
  }).send(res);
});
export { loginOrSignup };
