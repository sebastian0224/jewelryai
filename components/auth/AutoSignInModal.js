// components/AutoSignInModal.js
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function AutoSignInModal() {
  const searchParams = useSearchParams();
  const { openSignIn } = useClerk();
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  // Manejar redirección automática si ya está autenticado
  // useEffect(() => {
  //   if (isLoaded && isSignedIn) {
  //     router.push("/dashboard");
  //   }
  // }, [isSignedIn, isLoaded, router]);

  // Manejar auto-signin modal desde URL params
  useEffect(() => {
    const redirectUrl = searchParams.get("redirect_url");

    if (redirectUrl) {
      console.log("Redireccionando al modal de inicio de sesión...");
      openSignIn({ redirectUrl });
    }
  }, [searchParams, openSignIn]);

  return null;
}
