"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { SignInTab } from "./_components/sign-in-tab";
import { SignUpTab } from "./_components/sign-up-tab";
import { SocialAuthButtons } from "./_components/social-auth-buttons";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

   useEffect(() => { //handling this in client side is not good it should be handled in server side //check gpt coversation
    authClient.getSession().then(session => {
      if (session.data != null) router.push("/")
    })
  }, [router])


  return (
    <Tabs defaultValue="signin" className="max-auto w-full py-6 px-4">
      <TabsList>
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>

      <TabsContent value="signin">
        <Card>
          <CardHeader className="text-2xl font-bold">
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <SignInTab />
          </CardContent>

          <Separator />
          <CardFooter className="grid grid-cols-2 gap-3">
            <SocialAuthButtons />
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="signup">
        <Card>
          <CardHeader className="text-2xl font-bold">
            <CardTitle>Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <SignUpTab />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
