import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // hanya izinkan akses jika token ada (sudah login)
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/events/:path*",
    "/profile/:path*",
    "/statistics/:path*",
    "/subscription/:path*",
    "/guest/:path*",
  ],
};
