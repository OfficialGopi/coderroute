import "dotenv/config";

import { z } from "zod";

function parseEnv(env: NodeJS.ProcessEnv) {
  const schema = z.object({
    NODE_ENV: z.string().default("development"),
    PORT: z.coerce.number().default(3000),
    CLIENT_URL: z.string(),
    DATABASE_URL: z.string(),
    JUDGE0_API_URL: z.string(),
    JUDGE0_API_KEY: z.string(),
    ACCESS_TOKEN_SECRET: z.string(),
    ACCESS_TOKEN_EXPIRY: z.string(),
    REFRESH_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_EXPIRY: z.string(),
    GROQ_API_KEY: z.string(),
    LIVEBLOCKS_SECRET_KEY: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_CALLBACK_URL: z.string(),
  });

  const { data, success, error } = schema.safeParse(env);

  if (!success) {
    throw new Error(`Invalid environment variables: ${error.message}`);
  }
  return data;
}

export const env = parseEnv(process.env);
