export const cookieOptions = {
  httpOnly: true,
  // cookies must be secure in production for SameSite=None to work
  secure: process.env.NODE_ENV === "production",
  // when deployed cross-site (frontend on Vercel, backend on Render) we need SameSite=None
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 1000 * 60 * 60, // 1 hour
};
