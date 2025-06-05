"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthHeader() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-white border-b shadow-sm py-3 px-6 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        AI Portfolio Generator ✨
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/upload">
          <Button variant="outline">Upload</Button>
        </Link>

        {status === "loading" ? (
          <span className="text-sm text-gray-500">Loading...</span>
        ) : session ? (
          <>
            <span className="text-sm">{session.user?.name}</span>
            <Button variant="ghost" onClick={() => signOut()}>
              Sign Out
            </Button>
          </>
        ) : (
          <Button onClick={() => signIn("google")}>Sign In with Google</Button>
        )}
      </div>
    </header>
  );
}
