"use client";
import { SignIn } from "@clerk/nextjs";
import { useEffect } from "react";

export default function Page() {
  const hasRefreshedKey = "hasRefreshed";

  useEffect(() => {
    const hasRefreshed = sessionStorage.getItem(hasRefreshedKey);

    if (!hasRefreshed) {
      sessionStorage.setItem(hasRefreshedKey, "true");
      setTimeout(() => {
        window.location.href = window.location.href;
      }, 100000); // Adding a slight delay to ensure state is updated
    } else {
      sessionStorage.removeItem(hasRefreshedKey);
    }
  }, []);

  return <SignIn />;
}
