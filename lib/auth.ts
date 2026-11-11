import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

import { isSignUpRole } from "@/lib/roles";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing. Add it to your .env file.");
}

const client = new MongoClient(uri);
const db = client.db("hireloop-db");

/** Standard Schema validator so only known roles can be stored. */
const roleValidator = {
  "~standard": {
    version: 1 as const,
    vendor: "hireloop",
    validate: (value: unknown) =>
      isSignUpRole(value)
        ? { value }
        : { issues: [{ message: "Role must be seeker, recruiter or admin" }] },
  },
};

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        input: true,
        defaultValue: "seeker",
        validator: { input: roleValidator },
      },
    },
  },
  // socialProviders: {
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID as string,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  //   },
  // },
  database: mongodbAdapter(db, {
    client,
  }),
});
