import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";
import arcjet, { BotOptions, EmailOptions, SlidingWindowRateLimitOptions, detectBot, protectSignup, shield, slidingWindow } from '@arcjet/next' //import the arcjet here
import { findIp } from "@arcjet/ip";

const aj =arcjet({
    key : process.env.ARCJET_API_KEY!,
    characteristics: ['userIdorIp'],//we can ratelimit
    rules : [shield({mode: "LIVE"})], //protect us from bots, sql injection

})
const botSetting ={mode :"LIVE", allow :[]} satisfies BotOptions //when the allow is set "" means no bot is allowed

const restrictiveRateLimitSettngs = { //this allows us to prevent bruteforce and any other when the user sign in or sign up
    mode: "LIVE",
    max : 10,
    interval:"10m"
} as SlidingWindowRateLimitOptions<[]>

const laxRateLimitSettngs = { 
    mode: "LIVE",
    max : 60,
    interval:"1m"
} as SlidingWindowRateLimitOptions<[]>

const emailSettings = {
    mode: "LIVE",
    block : ['DISPOSABLE', "INVALID", "NO_MX_RECORDS"], //to block certain email like tempo email //no mx records check the type like instead of gmail user might write gmai or gmai.com...
} satisfies EmailOptions

const authHandlers = toNextJsHandler(auth);

export const { GET } = authHandlers;

export async function POST(request:Request) {
    const clonedRequest = request.clone()
    const decision = await checkArcjet(request)

    if(decision.isDenied()){
        if(decision.reason.isRateLimit()){
            return Response.json({error : null}, {status : 429})
        }else if(decision.reason.isEmail()){
            let message : string

            if(decision.reason.emailTypes.includes("INVALID")){
                message = "Email address format is invalid"
            }else if(decision.reason.emailTypes.includes("DISPOSABLE")){
                message = "Disposable email addresses are not allowed"
            }else if(decision.reason.emailTypes.includes("NO_MX_RECORDS")){
                message = "Email domain is not valid"
            }else{
                message = "Invalid email"
            }

            return Response.json({message}, {status : 400})
        }else{
            return new Response(null, {status : 403})
        }
    }
    return authHandlers.POST(clonedRequest)
} 

async function checkArcjet(request :Request) { //takes all requests and to check
    const body = (await request.json()) as unknown
    const session = await auth.api.getSession({headers: request.headers})

    const userIdOrIp = (session?.user.id ?? findIp(request)) || "127.0.0.1" //restrict user with the id or ip

    if(request.url.endsWith("/auth/sign-up")){
        if(body && typeof body === "object" && "email" in body && typeof body.email === "string"){
            return aj.withRule(protectSignup({email : emailSettings, bots: botSetting, rateLimit:restrictiveRateLimitSettngs})).protect(request, {email:body.email, userIdorIp:userIdOrIp})
        }else{
            return aj.withRule(detectBot(botSetting)).withRule(slidingWindow(restrictiveRateLimitSettngs)).protect(request, {userIdorIp: userIdOrIp})
        }
    }

    return aj.withRule(detectBot(botSetting)).withRule(slidingWindow(laxRateLimitSettngs)).protect(request,{userIdorIp:userIdOrIp})

}