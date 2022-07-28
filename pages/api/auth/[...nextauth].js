import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    EmailProvider({
      server: {
        host: "smtp.sendgrid.net",
        port: 587,
        auth: {
          user: "apikey",
          pass: "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",
        },
      },
      from: "filip.lapvetelainen@gmail.com",
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  database: process.env.DATABASE_URL,
  secret: "ashudasd",
});
