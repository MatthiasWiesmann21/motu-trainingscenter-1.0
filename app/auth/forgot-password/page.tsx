"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { useContainerData } from "@/hooks/useContainerData";

export default function ForgotPassword() {
  const [sendingEmail, setSendingEmail] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [beingSubmittedGoogle, setBeingSubmittedGoogle] = useState(false);
  const { container, loading } = useContainerData();
  const { theme } = useTheme();

  const getButtonColor = () =>
    theme === "dark"
      ? container?.DarkPrimaryButtonColor!
      : container?.PrimaryButtonColor!;

  const getForgotPasswordImage = () =>
    theme === "dark"
      ? container?.darkForgetPasswordImageUrl!
      : container?.forgetPasswordImageUrl!;

  const handleGoogleSignIn = async (event: any) => {
    if (!container?.active) {
      toast.error(
        "This Clubyte Container is deactivated, please ask the owner of this container for more information"
      );
    } else {
      event.preventDefault();
      setBeingSubmittedGoogle(true);
      try {
        await signIn("google", { callbackUrl: "/dashboard" });
      } catch (error) {
        toast.error("Failed to sign in with Google");
      } finally {
        setBeingSubmittedGoogle(false);
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!userEmail) {
      toast.error("Enter Email first");
      return;
    }

    setSendingEmail(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset email sent");
        setUserEmail("");
      } else {
        const errorMsg = data.message || "Failed to send password reset email";
        toast.error(errorMsg);
        console.error(errorMsg);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      handleForgotPassword();
    }
  };

  const renderRight = () => (
    <Image
      alt="ForgotPassword-Image"
      priority
      src={getForgotPasswordImage() || ""}
      width={1280}
      height={720}
      className="h-full w-full"
    />
  );

  const renderGoogleIcon = () => (
    <div className="flex items-center justify-center rounded-md border border-gray-300 px-12 py-3 transition duration-200 ease-in-out hover:bg-gray-100 dark:hover:text-black">
      <Image src="/images/google.png" alt="Google" width={24} height={24} />
      &nbsp; Sign{beingSubmittedGoogle ? "ing in..." : " in with Google"}
    </div>
  );

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center md:flex-row">
      <div className="w-full px-4 md:w-2/3 lg:w-2/3 xl:w-2/3">
        <form
          className="login-form mx-auto flex w-[80%] flex-col gap-4 p-4 sm:w-[70%] md:w-[65%]"
          onSubmit={(e) => e.preventDefault()}
          onKeyDown={handleKeyDown}
        >
          <div className="form-header">
            <Link
              href="/auth/sign-in"
              className="text-md mb-2 flex items-center transition hover:opacity-75"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to login
            </Link>
            <h2 className="text-4xl font-semibold dark:text-white">
              Forgot your password?
            </h2>
          </div>
          <div>
            <label
              className="mb-2 block text-xl font-medium text-black dark:text-white"
              htmlFor="email"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              name="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="h-12 w-full rounded-lg border border-gray-400 px-2 py-2 text-lg text-gray-700 focus:border-gray-500 focus:outline-none dark:text-gray-200"
              placeholder="Enter your email"
              autoComplete="off"
              autoFocus
            />
          </div>
          <Button
            onClick={handleForgotPassword}
            type="button"
            className="h-14 w-full rounded-full px-4 text-white"
            style={{ backgroundColor: getButtonColor() }}
          >
            <div className="flex justify-center text-xl">
              {sendingEmail ? "Submitting..." : "Submit"}
            </div>
          </Button>
          <div className="login-with relative mb-4 mt-6">
            <p className="text-center text-[19px]">Or login with</p>
          </div>
          <div className="button-boxes flex w-full justify-center gap-2">
            <div
              className="flex cursor-pointer items-center"
              onClick={handleGoogleSignIn}
            >
              {renderGoogleIcon()}
            </div>
          </div>
        </form>
        <div className="mt-4 flex justify-center">
          <ModeToggle />
        </div>
      </div>
      <div className="right-section hidden items-center justify-center md:flex md:w-1/2 lg:w-1/2 xl:w-1/2">
        {renderRight()}
      </div>
    </div>
  );
}