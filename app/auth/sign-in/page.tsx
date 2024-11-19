"use client";
import Head from "next/head";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import AppSVG from "@/components/appsvg";
import { Input } from "@/components/ui/input";
import { useContainerData } from "@/hooks/useContainerData";
import { useTheme } from "next-themes";

export default function SignIn() {
  const { container, loading } = useContainerData();
  const [userEmail, setUserEmail] = useState("");
  const { theme } = useTheme();
  const router = useRouter();
  const [beingSubmitted, setBeingSubmitted] = useState(false);
  const [beingSubmittedGoogle, setBeingSubmittedGoogle] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const getButtonColor = () => {
    if (theme === "dark") {
      return container?.DarkPrimaryButtonColor;
    } else {
      return container?.PrimaryButtonColor;
    }
  };

  const getSignInImage = () => {
    if (theme === "dark") {
      return container?.darkSignInImageUrl;
    } else {
      return container?.signInImageUrl;
    }
  };

  const handleGoogleSignIn = async (event: any) => {
    try {
      setBeingSubmittedGoogle(true);
      event.preventDefault();
      const googleSignInResp = await signIn("google", {
        callbackUrl: "/dashboard",
      });
      console.log("Google sign in response", googleSignInResp);
    } catch (error) {
      console.error("Google sign-in error:", error);
    } finally {
      setBeingSubmittedGoogle(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission behavior
    setBeingSubmitted(true);
    const email = form.email;
    const password = form.password;

    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    console.log("The response from submission login", response);
    if (response?.error) {
      toast.error(response?.error || "Invalid Credentials");
    } else {
      router.replace("/dashboard");
      toast.success("Login Successful");
    }

    setBeingSubmitted(false);
  };

  const renderRight = () => {
    return <Image alt="SignIn-Image" priority src={getSignInImage() || ""} width={1280} height={720} className="h-full w-full" />
  };

  const renderGoogleIcon = () => {
    return (
      <div className="flex items-center justify-center rounded-md border border-gray-300 px-12 py-3 transition duration-200 ease-in-out hover:bg-gray-100 dark:hover:text-black">
        <Image src="/images/google.png" alt="Google" width={24} height={24} />
        &nbsp; Sign{beingSubmittedGoogle ? "ing in..." : " in with Google"}
      </div>
    );
  };

  return (
    <>
      <div className="flex h-screen w-full flex-col items-center justify-center md:flex-row">
        <div className="w-full md:w-2/3 lg:w-2/3 xl:w-2/3">
          <form className="mx-auto flex w-[80%] flex-col gap-2 p-4 sm:w-[70%] md:w-[65%] md:p-0">
            <div className="form-header">
              <h2 className="text-4xl font-semibold dark:text-white">Login</h2>
            </div>
            <div className=" mt-6">
              <label
                className="mb-2 block text-xl text-black dark:text-white md:text-[22px]"
                htmlFor="email"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                name="email"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="h-12 w-full rounded-lg border border-gray-300 px-2 py-2 text-lg text-gray-700 focus:border-gray-300 focus:outline-none dark:text-gray-200"
                placeholder="Enter your email"
                autoComplete="off"
                autoFocus
              />
            </div>
            <div className="mb-6">
              <label
                className="mb-2 block text-xl text-black dark:text-white md:text-[22px]"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="h-12 w-full rounded-lg border border-gray-300 px-2 py-2 text-lg text-gray-700 focus:border-gray-300 focus:outline-none dark:text-gray-200"
                  placeholder="Enter your password"
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-right">
                <Link
                  href="/auth/forgot-password"
                  className="text-lg hover:underline"
                  style={{ color: getButtonColor() }}
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <Button
              onClick={handleSubmit}
              type="button"
              className="h-14 w-full rounded-full px-4 text-white"
              style={{ backgroundColor: getButtonColor() }}
            >
              <div className="flex justify-center text-xl">Login</div>
            </Button>
            <div className="mt-2 flex justify-center text-lg">
              <p>
                Don’t have an account?{" "}
                <span style={{ color: getButtonColor() }}>
                  <Link href="/auth/sign-up" className="hover:underline">
                    Sign Up
                  </Link>
                </span>
              </p>
            </div>
            <div className="login-with relative mb-4 mt-4 flex items-center justify-center">
              <p className="text-lg">Or login with</p>
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
    </>
  );
}
