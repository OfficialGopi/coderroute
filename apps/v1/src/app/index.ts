import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "./constants/cors.constant";
import { ApiResponse } from "./utils/response.util";
import { configurePassport, passport } from "./libs/passport.lib";
import { authRouter } from "./routes/auth.route";

const app = express();

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
configurePassport();

app.use(cookieParser());

app.get("/api/v1/health", (_req, res) => {
  return new ApiResponse(200, undefined, "Healthy").send(res);
});

app.use("/api/v1/auth", authRouter);

export { app };
