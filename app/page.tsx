"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function Home() {
  const { data: session, isPending: loading } = authClient.useSession(); //this is the way to get the session from the client side

  if (loading) return <div>Loading...</div>;

  return (
    <div className="my-6 px-4 max-w-md mx-auto">
      <div className="text-center space-y-6">

        {session === null ? ( //if the session is null, the user is not logged in
          <>
            <h1 className="text-3xl font-bold">Welcome to Our App</h1>
            <Button asChild size={"lg"}>
              <Link href="/auth/login">Signs In / Sign Up</Link>
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">Welcome {session.user.name}!</h1>
            <Button
              size={"lg"}
              variant={"destructive"}
              onClick={() => authClient.signOut()}
            >
              Sign Out
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
