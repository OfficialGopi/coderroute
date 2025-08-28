import { PrismaClient, User } from "../app/models/client";

declare global {
  namespace Express {
    interface Request {
      user?: Partial<User> & {
        id: string;
        email: string;
      };
    }
  }
  namespace globalThis {
    var prisma: PrismaClient | undefined;
  }
}

export {};
