import { cookieOptions, tokenFieldNames } from "../constants/cookie.constant";
import { decodeTokenAndExtractUser } from "../services/model.service";
import { AsyncHandler } from "../utils/async-handler.util";
import { ApiError } from "../utils/response.util";

const authenticateUser = AsyncHandler(async (req, res, next) => {
  const accessToken = req.cookies[tokenFieldNames.accessToken];
  if (!accessToken) {
    res.clearCookie(tokenFieldNames.accessToken, cookieOptions);
    throw new ApiError(401, "Access token not found");
  }

  const decodedUser = await decodeTokenAndExtractUser(accessToken);

  if (!decodedUser) {
    res.clearCookie(tokenFieldNames.accessToken, cookieOptions);
    throw new ApiError(401, "Invalid access token");
  }

  req.user = decodedUser;
  next();
});

export { authenticateUser };
