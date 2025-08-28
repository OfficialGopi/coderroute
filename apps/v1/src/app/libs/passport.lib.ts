import passport from "passport";
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth20";
import { env } from "../../env";
import { Request } from "express";
import { db } from "../../db";

function configurePassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
        scope: ["profile", "email"],
        passReqToCallback: true,
      },
      async (
        req: Request,
        __: string,
        _: string,
        profile,
        done: VerifyCallback
      ) => {
        try {
          const email = profile?.emails?.[0]?.value;
          const displayName = profile.displayName || "";
          const photo = profile.photos?.[0]?.value;
          if (!email) {
            throw new Error("Email not provided by Google");
          }

          let user = await db.user.findUnique({
            where: {
              email,
            },
          });

          if (!user) {
            user = await db.user.create({
              data: {
                email,
                image: photo,
                name: displayName,
              },
            });
          }

          return done(null, user);
        } catch (error) {
          done(
            error instanceof Error ? error : new Error("Authentication failed")
          );
        }
      }
    )
  );
}

export { passport, configurePassport };
