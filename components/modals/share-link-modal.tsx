"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useModal } from "@/hooks/use-modal-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/check-language";
import { usePathname } from "next/navigation";

// Define props with id (string or number) and any additional children elements
interface ShareLinkModalProps {
  id: string | number;
  path?: string;
  children: React.ReactNode;
}

export const ShareLinkModal = ({ id, path, children }: ShareLinkModalProps) => {
  const currentLanguage = useLanguage();
  const pathname = usePathname();

  const [copied, setCopied] = useState(false);

  // Construct the invite URL with id parameter
  // @ts-ignore
  const inviteUrl = `${window.location.origin}${!path ? `${pathname}` : `${path}`}/${id}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="overflow-hidden p-0">
        <AlertDialogHeader className="px-6 pt-8">
          <AlertDialogTitle className="text-center text-2xl font-bold">
            {currentLanguage.modal_share_link_title}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="p-6">
          <Label className="text-xs font-bold uppercase">
            {currentLanguage.modal_share_link_label}
          </Label>
          <div className="mt-2 flex items-center gap-x-2">
            <Input
              disabled={true}
              className="ring-offset-0"
              value={inviteUrl}
              readOnly
            />
            <Button onClick={onCopy} size="icon">
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <AlertDialogFooter className="px-6 py-4">
          <AlertDialogCancel>
            {currentLanguage.descriptionModal_DialogCancel}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
