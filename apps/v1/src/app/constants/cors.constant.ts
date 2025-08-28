import { CorsOptions } from "cors";
import { env } from "../../env";

const corsOptions: CorsOptions = {
  origin: env.CLIENT_URL ?? "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export { corsOptions };
