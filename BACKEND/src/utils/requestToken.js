export const getRequestToken = (req) => {
  const cookieToken = req.cookies?.accessToken;
  if (cookieToken) {
    return cookieToken;
  }

  const authorizationHeader = req.get("authorization") || "";
  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme?.toLowerCase() === "bearer" && token) {
    return token;
  }

  return null;
};
