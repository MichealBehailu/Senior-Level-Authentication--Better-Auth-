"use client";
import {
  ControllerFieldState,
  ControllerRenderProps,
  UseFormStateReturn,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ReactElement, JSXElementConstructor } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { router } from "better-auth/api";
import { useRouter } from "next/navigation";

const signInSchema = z.object({
  email: z.email().min(1),
  password: z.string().min(6),
});

type SignInForm = z.infer<typeof signInSchema>;

export function SignInTab({
  openEmailVerificationTab,
}: {
  openEmailVerificationTab: (email: string) => void
}) {

  //we can use useTransition // to get teh pending and  to disable the buttons when submitting , easy to use 
  //const [emailPending , startEmailTransition ] = useTransition()
  
  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const router = useRouter()

  async function HandleSignIn(data: SignInForm) {
    await authClient.signIn.email(
      { ...data, callbackURL: "/" },
      {
        onError: error => {
          if (error.error.code === "EMAIL_NOT_VERIFIED") {
            openEmailVerificationTab(data.email)
          }
          toast.error(error.error.message || "Failed to sign in")
        } ,
        onSuccess: ()=>{
          router.push('/')
          toast.success("Signed in successfully")
        }
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(HandleSignIn)} className="space-y-4">

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          <LoadingSwap isLoading={isSubmitting}>Sign In</LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}
