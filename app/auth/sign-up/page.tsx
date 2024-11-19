"use client";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppSVG from "@/components/appsvg";
import { Input } from "@/components/ui/input";
import { useContainerData } from "@/hooks/useContainerData";
import { useTheme } from "next-themes";

export default function SignUp() {
  const { container, loading } = useContainerData();
  const router = useRouter();
  const [beingSubmitted, setBeingSubmitted] = useState(false);
  const { theme } = useTheme();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getButtonColor = () => {
    if (theme === "dark") {
      return container?.DarkPrimaryButtonColor;
    } else {
      return container?.PrimaryButtonColor;
    }
  };

  const getSignUpImage = () => {
    if (theme === "dark") {
      return container?.darkSignUpImageUrl;
    } else {
      return container?.signUpImageUrl;
    }
  };

  const handleGoogleSignIn = (event: any) => {
    event.preventDefault();
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const validatePasswordStrength = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter";
    }
    if (!hasNumber) {
      return "Password must contain at least one number";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  const handleSubmit = async (event: any) => {
    try {
      event.preventDefault();
      const { name, email, password, confirmPassword } = form;

      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      const passwordError = validatePasswordStrength(password);
      if (passwordError) {
        toast.error(passwordError);
        return;
      }

      setBeingSubmitted(true);

      // Handle your registration logic here, e.g., sending data to your backend
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      const jsonObj = await response.json();

      if (jsonObj.error) {
        toast.error(jsonObj.error);
      } else {
        const response = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        router.replace("/dashboard");
      }
    } catch (error) {}
    setBeingSubmitted(false);
  };

  const renderRight = () => {
    return <Image alt="SignUp-Image" priority src={getSignUpImage()} width={1280} height={720} className="w-full h-full" />; 
  };

  const renderGoogleIcon = () => {
    return (
      <div className="flex items-center justify-center rounded-md border border-gray-300 px-12 py-3 transition duration-200 ease-in-out hover:bg-gray-100 dark:hover:text-black">
        <Image src="/images/google.png" alt="Google" width={24} height={24} />
        &nbsp; Sign in with Google
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center md:flex-row">
      <div className="w-full px-4 md:w-2/3 lg:w-2/3 xl:w-2/3">
        <form className="login-form mx-auto flex w-[80%] max-w-xl flex-col p-4 sm:w-[70%] md:w-[70%]">
          <div className="form-header mb-6">
            <h2 className="text-2xl font-semibold text-black dark:text-white md:text-3xl">
              Sign Up
            </h2>
          </div>
          <div className="mb-2">
            <label
              className="mb-2 block text-lg font-medium text-black dark:text-white md:text-xl"
              htmlFor="name"
            >
              Name
            </label>
            <Input
              id="name"
              type="text"
              name="name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="h-12 w-full rounded-lg border border-gray-300 px-2 py-2 text-lg text-gray-700 focus:border-gray-300 focus:outline-none dark:text-gray-200"
              placeholder="Enter your name"
              autoComplete="off"
              autoFocus
            />
          </div>
          <div className="mb-2">
            <label
              className="mb-2 block text-lg font-medium text-black dark:text-white md:text-xl"
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
            />
          </div>
          <div className="mb-2">
            <label
              className="mb-2 block text-lg font-medium text-black dark:text-white md:text-xl"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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
          </div>
          <div className="mb-6">
            <label
              className="mb-2 block text-lg font-medium text-black dark:text-white md:text-xl"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                className="h-12 w-full rounded-lg border border-gray-300 px-2 py-2 text-lg text-gray-700 focus:border-gray-300 focus:outline-none dark:text-gray-200"
                placeholder="Confirm your password"
              />
              <span
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </span>
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            type="button"
            className="h-14 w-full rounded-full px-4 text-white"
            style={{ backgroundColor: getButtonColor() }}
          >
            <div className="flex justify-center text-lg md:text-xl">
              {beingSubmitted ? (
                <Image
                  src="/loader-blur-white.svg"
                  alt="preloader"
                  width={20}
                  height={20}
                />
              ) : (
                "Sign Up"
              )}
            </div>
          </Button>
          <div className="mt-2 flex justify-center text-lg">
            <p>
              Already have an account?{" "}
              <span style={{ color: getButtonColor() }}>
                <Link href="/auth/sign-in" className="hover:underline">
                  Sign In
                </Link>
              </span>
            </p>
          </div>
          <div className="login-with relative mb-4 mt-4">
            <p className="text-center text-lg">Or sign up with</p>
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
      <div className="hidden items-center justify-center md:flex md:w-1/2 lg:w-1/2 xl:w-1/2">
        {renderRight()}
      </div>
    </div>
  );
}
