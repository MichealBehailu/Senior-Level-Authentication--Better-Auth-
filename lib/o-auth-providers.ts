import { ComponentProps, ElementType } from "react"
import { DiscordIcon, GitHubIcon } from "../components/auth/o-auth-icons"

export const SUPPORTED_OAUTH_PROVIDERS = ["github", "discord"] as const 
export type SupportedOAuthProviders = (typeof SUPPORTED_OAUTH_PROVIDERS)[number]

export const SUPPORTED_OAUTH_PROVIDER_DETAILS : Record<SupportedOAuthProviders, {name:string, Icon: ElementType<ComponentProps<"svg">>}>= {
    discord : {name : "Discord", Icon: DiscordIcon},
    github : {name: "Github", Icon : GitHubIcon}
}