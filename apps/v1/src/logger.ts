import winston from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "server" },
  transports: [new winston.transports.Console()],
});
