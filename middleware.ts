import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/sign-in",
    error: '/auth/sign-in?error=unauthorized',
  },
});
export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/documents",
    "/news",
    "/live-event",
    "/search",
  ],
};