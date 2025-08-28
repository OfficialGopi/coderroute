import { AsyncHandler } from "../utils/async-handler.util";

const loginOrSignup = AsyncHandler(async (req, res) => {
  const user = req.user;
});

export { loginOrSignup };
