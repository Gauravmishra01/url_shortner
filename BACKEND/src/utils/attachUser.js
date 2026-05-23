import { findUserById } from "../dao/user.dao.js";
import { verifyToken } from "./helper.js";
import { getRequestToken } from "./requestToken.js";

export const attachUser = async (req, res, next) => {
  const token = getRequestToken(req);
  if (!token) return next();

  try {
    const decoded = verifyToken(token);
    const user = await findUserById(decoded);
    if (!user) return next();
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    next();
  }
};
