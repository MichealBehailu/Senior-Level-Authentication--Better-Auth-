import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db"; // your drizzle instance

export const auth = betterAuth({
    emailAndPassword: { 
    enabled: true, 
  },
  // rateLimit:{ //is a protection mechanism that limits how many times an action can be performed within a certain time window.
  //   storage : "database"
  // },
  session: { //cache the use session
    cookieCache:{
      enabled:true,
      maxAge:60 * 5//five minutes
    }
    
  },
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
    }),

    // Next.js cookies are handled automatically by toNextJsHandler //so no need to set pulgins:[nextCookies()]
});