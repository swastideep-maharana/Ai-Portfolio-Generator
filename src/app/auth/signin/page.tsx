"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const router = useRouter();

  const handleSignIn = async () => {
    await signIn("google", { callbackUrl: "/upload" }); 
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Button
        onClick={handleSignIn}
        className="text-white bg-black hover:bg-gray-800"
      >
        Sign in with Google
      </Button>
    </div>
  );
}
