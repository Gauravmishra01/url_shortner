const normalizeBaseUrl = (value = "") => value.replace(/\/$/, "");

export const getPublicBaseUrl = (req) => {
  const forwardedProto = req.get("x-forwarded-proto") || req.protocol || "http";
  const forwardedHost = req.get("x-forwarded-host") || req.get("host");
  const requestBase = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : "";

  if (requestBase) return normalizeBaseUrl(requestBase);

  const configuredBase = normalizeBaseUrl(process.env.APP_URL || "");
  if (configuredBase) return configuredBase;

  return "";
};

export const buildRedirectUrl = (req, shortUrl) => {
  const baseUrl = getPublicBaseUrl(req);
  return baseUrl ? `${baseUrl}/${shortUrl}` : `/${shortUrl}`;
};

export const buildQrRedirectUrl = (req, shortUrl) => {
  const baseUrl = getPublicBaseUrl(req);
  return baseUrl ? `${baseUrl}/qr/${shortUrl}` : `/qr/${shortUrl}`;
};
