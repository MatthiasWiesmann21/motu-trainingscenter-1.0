"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface LogoProps {
  imageUrl: string;
  imageUrlDark: string;
  link: string;
}

export const Logo = ({ imageUrl, imageUrlDark, link }: LogoProps) => {
  const { theme } = useTheme();

  const imageUrlNew = theme === "dark" ? imageUrlDark : imageUrl;

  return (
    <AspectRatio ratio={21 / 9}>
    <Link target={link ?? ""} href={link ?? ""}>
      <Image
        priority
        height={200}
        width={200}
        alt="logo"
        src={imageUrlNew ?? ""}
        className="h-full w-full object-cover"
      />
    </Link>
    </AspectRatio>
  );
};
