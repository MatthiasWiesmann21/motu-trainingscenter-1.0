"use client";

import toast from "react-hot-toast";

interface ResendVerificationButtonProps {
  userId: string;
  label: string;
}

export const ResendVerificationButton = ({
  userId,
  label,
}: ResendVerificationButtonProps) => {
  const handleResendVerification = async () => {
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      toast.success("Verification email sent successfully!");
    } catch (error) {
      toast.error("Failed to resend verification email. Please try again later.");
    }
  };

  return (
    <button
      onClick={handleResendVerification}
      className="font-bold underline cursor-pointer"
    >
      {label}
    </button>
  );
};
