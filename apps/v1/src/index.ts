import http from "http";
import { env } from "./env";
import { app } from "./app";
import { logger } from "./logger";

function main(app: Express.Application) {
  const server = http.createServer(app);

  server.listen(env.PORT, () => {
    logger.info(`Server is running on http://localhost:${env.PORT}`);
  });
}

main(app);
