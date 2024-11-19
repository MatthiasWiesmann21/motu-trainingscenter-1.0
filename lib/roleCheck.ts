"use client";

import { useSelector } from "react-redux";

const useUserRole = () => useSelector((state: any) => state?.user);

export const useIsClientAdmin = () => useUserRole()?.role === "CLIENT ADMIN";

export const useIsAdmin = () => useUserRole()?.role === "ADMIN";

export const useIsOperator = () => useUserRole()?.role === "OPERATOR";

export const useIsModerator = () => useUserRole()?.role === "MODERATOR";

export const useIsUser = () => useUserRole()?.role === "USER";
