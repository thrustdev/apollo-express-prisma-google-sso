import { OAuth2Client } from "google-auth-library";
import _ from "lodash";
import axios from "axios";
import prisma from "./db/prisma";
import { User } from ".prisma/client";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);

console.log(process.env.GOOGLE_CLIENT_ID);
console.log(process.env.GOOGLE_CLIENT_SECRET);

const googleAuth = async (token: string) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID || "",
  });
  const payload = ticket.getPayload();
  console.log("[PAYLOAD]: ", payload);
  return {
    name: payload?.name || "",
    email: payload?.email || "",
    image: payload?.picture || "",
  };
};

const getTokenFromAuthCode = async (code: string): Promise<User | null> => {
  let user = {
    name: "",
    email: "",
    image: "",
    accessToken: "",
    refreshToken: "",
  };
  try {
    const res = await client.getToken(code);
    const tokens = res.tokens;

    if (!tokens.id_token) {
      throw new Error("No ID token Returned");
    }

    const profile = await googleAuth(tokens.id_token);
    user = {
      accessToken: tokens.access_token || "",
      refreshToken: tokens.refresh_token || "",
      ...profile,
    };

    let dbUser = await prisma.user.findUnique({
      where: { email: profile.email },
    });

    console.log("Existing user", dbUser);
    if (!dbUser) {
      dbUser = await prisma.user.create({ data: user });
    } else {
      prisma.user.update({
        where: { email: user.email },
        data: user,
      });
    }

    console.log("New User", dbUser);
    return dbUser;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export { getTokenFromAuthCode };
