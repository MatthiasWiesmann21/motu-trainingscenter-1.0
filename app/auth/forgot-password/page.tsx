"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import AppSVG from "@/components/appsvg";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { useContainerData } from "@/hooks/useContainerData";

export default function SignUp() {
  const [sendingEmail, setSendingEmail] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [beingSubmittedGoogle, setBeingSubmittedGoogle] = useState(false);
  const { container, loading } = useContainerData();
  const { theme } = useTheme();

  const getButtonColor = () => {
    if (theme === "dark") {
      return container?.DarkPrimaryButtonColor!;
    } else {
      return container?.PrimaryButtonColor!;
    }
  };

  const getForgotPasswordImage = () => {
    if (theme === "dark") {
      return container?.darkForgetPasswordImageUrl;
    } else {
      return container?.forgetPasswordImageUrl;
    }
  }

  const handleGoogleSignIn = (event: any) => {
    event.preventDefault();
    setBeingSubmittedGoogle(true);
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleForgotPassword = async () => {
    if (!userEmail) {
      toast.error("Enter Email first");
      return;
    } else {
      setSendingEmail(true);

      try {
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }), // Ensure userEmail is passed as an object
        });

        const data = await response.json();

        if (response.ok) {
          // Handle success (e.g., show a success message)
          console.log("Password reset email sent:");
          toast.success("Password reset email sent");
          setUserEmail("");
        } else {
          // Handle error response
          toast.error(data.message);
          console.error("Failed to send password reset email:", data.message);
        }
      } catch (error) {
        // Handle fetch error
        console.error("An error occurred:", error);
      } finally {
        setSendingEmail(false); // Reset the sending state
      }
    }
  };

  const renderRight = () => {
    return (
     <Image alt="ForgotPassword-Image" priority src={getForgotPasswordImage() || ""} width={1280} height={720} className="w-full h-full" />
    );
  };
  const renderGoogleIcon = () => {
    return (
      <div className="flex items-center justify-center hover:bg-gray-100 dark:hover:text-black rounded-md px-12 py-3 border border-gray-300 transition ease-in-out duration-200">
        <Image src="/images/google.png" alt="Google" width={24} height={24} />
        &nbsp; Sign{beingSubmittedGoogle ? "ing in..." : " in with Google"}
      </div>
    );
  };

  return (
    <>
      <div className="flex h-screen w-full flex-col items-center justify-center md:flex-row">
        <div className="w-full md:w-2/3 lg:w-2/3 xl:w-2/3">
          <form className="login-form mx-auto flex w-[80%] flex-col gap-2 p-4 sm:w-[70%] md:w-[65%] md:p-0">
            <div className="form-header">
              <Link
                href={`/auth/sign-in`}
                className="mb-2 flex items-center text-md transition hover:opacity-75"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to login
              </Link>
              <h2 className="text-4xl font-semibold dark:text-white">Forgot your password?</h2>
            </div>
            <div className="mt-6">
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
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full rounded-lg border text-lg border-gray-400 px-2 py-2 h-12 text-gray-700 dark:text-gray-200 focus:border-gray-500 focus:outline-none"
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
                className="flex items-center cursor-pointer"
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
    </>
  );
}
