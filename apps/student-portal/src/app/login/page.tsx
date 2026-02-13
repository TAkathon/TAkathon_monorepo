"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getLandingUrl } from "@shared/utils";

export default function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace(`${getLandingUrl()}/login`);
  }, [router]);
  return null;
}
