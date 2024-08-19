"use client";

import qs from "query-string";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useLanguage } from "@/lib/check-language";

export const SearchInput = () => {
  const [value, setValue] = useState("")
  const debouncedValue = useDebounce(value);
  const currentLanguage = useLanguage();


  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // @ts-ignore
  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl({
      // @ts-ignore
      url: pathname,
      query: {
        categoryId: currentCategoryId,
        title: debouncedValue,
      }
    }, { skipEmptyString: true, skipNull: true });

    router.push(url);
  }, [debouncedValue, currentCategoryId, router, pathname])

  return (
    <div className="relative">
      <Search
        className="h-4 w-4 absolute top-3 left-3 text-slate-500"
      />
      <Input
        onChange={(e) => setValue(e.target.value)}
        value={value}
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200 dark:bg-slate-950"
        placeholder={currentLanguage.navigation_search_placeholder}
      />
    </div>
  )
}