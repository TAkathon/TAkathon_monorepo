"use client";
import { useEffect } from "react";
import { getLandingUrl } from "@shared/utils";

export default function SignUpPage() {
  useEffect(() => {
    window.location.href = `${getLandingUrl()}/signup`;
  }, []);
  return null;
}
