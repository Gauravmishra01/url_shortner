import { getShortUrl, recordAccess } from "../dao/short_url.js";
import {
  createShortUrlWithoutUser,
  createShortUrlWithUser,
} from "../services/short_url.service.js";
import { NotFoundError } from "../utils/errorHandler.js";
import wrapAsync from "../utils/tryCatchWrapper.js";
import { buildQrRedirectUrl, buildRedirectUrl } from "../utils/publicUrl.js";

export const createShortUrl = wrapAsync(async (req, res) => {
  const data = req.body;
  let shortUrl;
  if (req.user) {
    shortUrl = await createShortUrlWithUser(data.url, req.user._id, data.slug);
  } else {
    shortUrl = await createShortUrlWithoutUser(data.url);
  }
  res.status(200).json({
    shortUrl: buildRedirectUrl(req, shortUrl),
    qrUrl: buildQrRedirectUrl(req, shortUrl),
  });
});

export const redirectFromShortUrl = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const url = await getShortUrl(id);
  if (!url) throw new NotFoundError("Short URL not found");
  await recordAccess(id, {
    type: "click",
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });
  res.redirect(url.full_url);
});

export const qrRedirect = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const url = await getShortUrl(id);
  if (!url) throw new NotFoundError("Short URL not found");
  await recordAccess(id, {
    type: "qr",
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });
  res.redirect(url.full_url);
});

export const createCustomShortUrl = wrapAsync(async (req, res) => {
  const { url, slug } = req.body;
  const shortUrl = await createShortUrlWithUser(
    url,
    req.user?._id ?? null,
    slug,
  );
  res.status(200).json({
    shortUrl: buildRedirectUrl(req, shortUrl),
    qrUrl: buildQrRedirectUrl(req, shortUrl),
  });
});
