import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db"; // your drizzle instance

export const auth = betterAuth({
    emailAndPassword: { 
    enabled: true, 
    requireEmailVerification:true,
    sendResetPassword: async ({user, url})=>{
      await sendPasswordResetEmail({user, url})
    }
  },
  // rateLimit:{ //is a protection mechanism that limits how many times an action can be performed within a certain time window.
  //   storage : "database"
  // },
  emailVerification:{
    autoSignInAfterVerification:true,
    sendOnSignUp:true,
    sendVerificationEmail: async ({user, url})=>{
      await sendEmailVerificationEmail({user, url})
    }
  },
  socialProviders:{
    github : {
      clientId : process.env.GITHUB_CLIENT_ID!,
      clientSecret : process.env.GITHUB_CLIENT_SECRET!
    },
    discord :{
      clientId : process.env.DISCORD_CLIENT_ID!,
      clientSecret : process.env.DISCORD_CLIENT_SECRET! //this secret never goes to the browser
    }
  },
 
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

function sendPasswordResetEmail(arg0: { user: { id: string; createdAt: Date; updatedAt: Date; email: string; emailVerified: boolean; name: string; image?: string | null | undefined; }; url: string; }) {
  throw new Error("Function not implemented.");
}

function sendEmailVerificationEmail(arg0: { user: { id: string; createdAt: Date; updatedAt: Date; email: string; emailVerified: boolean; name: string; image?: string | null | undefined; }; url: string; }) {
  throw new Error("Function not implemented.");
}
    // Next.js cookies are handled automatically by toNextJsHandler //so no need to set pulgins:[nextCookies()]
