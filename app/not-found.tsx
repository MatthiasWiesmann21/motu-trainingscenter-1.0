"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/check-language";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const currentLanguage = useLanguage();

  return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-slate-900">404</h1>
          <h2 className="text-3xl font-semibold text-slate-600">{currentLanguage.page_not_found}</h2>
          <p className="text-slate-500 text-lg">
            {currentLanguage.oops_the_page_you_re_look}
          </p>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <Button onClick={() => router.back()} variant="outline" className="px-6">
            {currentLanguage.button_go_back}
          </Button>
        </div>
      </div>
    </div>
  );
};