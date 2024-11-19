import { useLanguage } from "@/lib/check-language";
import { languageServer } from "@/lib/check-language-server";
import { Hash } from "lucide-react";

interface ChatWelcomeProps {
  name: string | null;
  type: "channel" | "conversation";
}

export const ChatWelcome = ({ name, type }: ChatWelcomeProps) => {
  const currentLnaguage = useLanguage();
  return (
    <div className="mb-4 space-y-2 px-4">
      {type === "channel" && (
        <div className="flex h-[75px] w-[75px] items-center justify-center rounded-full bg-[#fff] dark:bg-[#1d2939]">
          <Hash className="h-12 w-12 text-slate-600 dark:text-slate-100" />
        </div>
      )}
      <p className="text-xl font-bold md:text-3xl">
        {type === "channel" ? `${currentLnaguage.chat_welcome_title}` : ""}
        {name}
      </p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {type === "channel"
          ? `${currentLnaguage.chat_welcome_description}${name} ${currentLnaguage.chat_welcome_description2}`
          : `${currentLnaguage.chat_welcome_title_directMessage} ${name}`}
      </p>
    </div>
  );
};
