import NextAuth from "next-auth";

import { createTransport } from "nodemailer";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    EmailProvider({
      server: {
        host: "smtp.mailgun.org",
        port: 587,
        auth: {
          user: "postmaster@sandboxdade1da5314244b5ae2757b82f4e874e.mailgun.org",
          pass: "69a9f034f1f594f0440e234a85c9e48d-835621cf-b8eb305b",
        },
      },
      from: "postmaster@sandboxdade1da5314244b5ae2757b82f4e874e.mailgun.org",
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  database: process.env.DATABASE_URL,
  secret: "ashudasd",
});
