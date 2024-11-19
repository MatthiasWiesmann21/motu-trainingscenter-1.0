"use client";

import { ArrowLeft } from "lucide-react";

type GoBackButtonProps = {
  buttonText: string;
};

const GoBackButton: React.FC<GoBackButtonProps> = ({ buttonText }) => {
  const goBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <button
      onClick={goBack}
      className="mb-6 flex items-center text-sm transition hover:opacity-75"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {buttonText}
    </button>
  );
};

export default GoBackButton;
