"use client";

import { useState } from "react";
import axios from "axios";
import { useLanguage } from "@/lib/check-language";
import { Button } from "../ui/button";

interface PrivacyPolicyModalProps {
  profile: { id: string; acceptedPrivacyPolicy: boolean } | null;
}

export default function PrivacyPolicyModal({
  profile,
}: PrivacyPolicyModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(
    profile?.acceptedPrivacyPolicy === false
  );
  const currentLanguage = useLanguage();

  const acceptedPrivacyPolicy = async () => {
    const response = await axios.patch(`/api/profile/${profile?.id}`, {
      acceptedPrivacyPolicy: true,
    });

    if (response.status === 200) {
      window.location.pathname = "/profile";
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed w-full h-full inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50 backdrop-filter backdrop-blur-sm"></div>
      <div className="relative z-10 bg-white p-4 sm:m-20 md:m-32 lg:m-32 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-black mb-2">
          {currentLanguage.privacy_policy_title}
        </h2>
        <p className="text-black text-sm">
          {currentLanguage.privacy_policy_description}
        </p>
        <div className="flex justify-between items-center mt-2">
          <div className="flex space-x-4 mt-4">
            <a href="https://clubyte.live/privacy-policy" target="_blank" className="text-[#e72192]">
              {currentLanguage.privacy_policy_link}
            </a>
            <a href="https://clubyte.live/terms-of-service" target="_blank" className="text-[#e72192]">
              {currentLanguage.privacy_termsOfService_link}
            </a>
          </div>
          <Button
            className="ml-auto mt-4 bg-[#e72192] text-white px-4 py-2 rounded-md transition ease-in-out duration-300 cursor-pointer"
            onClick={acceptedPrivacyPolicy}
            variant="secondary"
          >
            {currentLanguage.privacy_policy_button}
          </Button>
        </div>
      </div>
    </div>
  );
}
