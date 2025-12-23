"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import {
  SUPPORTED_OAUTH_PROVIDERS,
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
} from "@/lib/o-auth-providers";
export function SocialAuthButtons() {
  return SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
    const Icon = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].Icon;

    return (
      <BetterAuthActionButton
        variant={"outline"}
        key={provider}
        action={() => {
          return authClient.signIn.social({ provider, callbackURL: "/" });
        }}
      >
        <Icon />
        {SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name}
      </BetterAuthActionButton>
    );
  });
}
