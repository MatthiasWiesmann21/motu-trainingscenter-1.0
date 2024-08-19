"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/check-language";

interface MailFormProps {
  initialData: {
    email: string;
  };
  profileId: string;
};

export const ShowUserMail = ({
  initialData,
}: MailFormProps) => {

  const currentLanguage = useLanguage();

  return (
    <div className="mt-6 border bg-slate-200 dark:bg-slate-700 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        {currentLanguage.user_MailForm_title}
      </div>
        <p className="text-sm mt-2 break-words">
          {initialData.email}
        </p>
    </div>
  )
}