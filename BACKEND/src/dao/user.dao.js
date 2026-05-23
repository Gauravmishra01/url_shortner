import User from "../models/user.model.js";
import UrlModel from "../models/short_url.model.js";

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const findUserByEmailByPassword = async (email) => {
  return await User.findOne({ email }).select("+password");
};

export const findUserById = async (id) => {
  return await User.findById(id);
};

export const createUser = async (name, email, password) => {
  const newUser = new User({ name, email, password });
  await newUser.save();
  return newUser;
};

export const getAllUserUrlsDao = async (id) => {
  return await UrlModel.find({ user: id });
};

export const getUserWorkspaceStateDao = async (id) => {
  return await User.findById(id).select("workspaceState");
};

export const updateUserWorkspaceStateDao = async (id, workspaceState) => {
  return await User.findByIdAndUpdate(
    id,
    { workspaceState },
    { new: true, runValidators: true },
  ).select("workspaceState");
};
