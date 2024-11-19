"use client";

import { useLanguage } from "@/lib/check-language";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface IsBannedViewProps {
  profile: { id: string; isBanned: string } | null;
}

const IsBannedView = ({ profile }: IsBannedViewProps) => {
  const currentLanguage = useLanguage();
  const router = useRouter();

  if (profile?.isBanned === "NOT BANNED") return null;
  
  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-slate-400">
      <div className="rounded-xl bg-slate-100 p-12 shadow-xl">
        <p className="flex justify-center text-2xl font-bold text-black">
          Your account has been banned.
        </p>
        <p className="text-black">
          Please, message an Admin to unban your account on this Plattform.
        </p>
        <Button
          variant="primary"
          className="mt-4 w-full p-4 font-bold"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default IsBannedView;
