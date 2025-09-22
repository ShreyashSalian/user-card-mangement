import express from "express";
import { User } from "../models/user.model";
import { asyncHandler, sendError, sendSuccess } from "../utils/function";

import { Login } from "../models/login.model";
import { LoginBody } from "../helpers/User.helper";
import { CONSTANT_LIST } from "../constants/global.constants";

const generateAccessAndRefreshToken = async (
  userId: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("Sorry, no user found");
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  return { accessToken, refreshToken };
};

export const loginUser = asyncHandler(
  async (
    req: express.Request<{}, {}, LoginBody>,
    res: express.Response
  ): Promise<express.Response> => {
    const { userNameOrEmail, password } = req.body;
    const userDetail = await User.findOne({
      $or: [
        {
          userName: userNameOrEmail,
        },
        {
          email: { $regex: userNameOrEmail, $options: "i" },
        },
      ],
    });
    if (!userDetail) {
      return sendError(
        res,
        CONSTANT_LIST.STATUS_ERROR,
        CONSTANT_LIST.BAD_REQUEST,
        "Sorry no user found with the given userName or email"
      );
    }
    if (userDetail.isDeleted) {
      return sendError(
        res,
        CONSTANT_LIST.STATUS_ERROR,
        CONSTANT_LIST.BAD_REQUEST,
        "Sorrym your account has been disabled by admin"
      );
    }
    const passwordCheck = await userDetail.comparePassword(password);
    if (!passwordCheck) {
      return sendError(
        res,
        CONSTANT_LIST.STATUS_ERROR,
        CONSTANT_LIST.BAD_REQUEST,
        "Please enter the valid password."
      );
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      userDetail?._id
    );
    await Login.create({
      userId: userDetail?._id,
      email: userDetail?.email,
      accessToken,
      refreshToken,
    });
    const loginUser = await User.findById(userDetail?._id).select("-password");
    return sendSuccess(
      res,
      CONSTANT_LIST.STATUS_SUCCESS,
      CONSTANT_LIST.STATUS_CODE_OK,
      "Login user detail",
      {
        loginUser,
        accessToken,
        refreshToken,
      }
    );
  }
);

export const logout = asyncHandler(
  async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const user = req.user?.userId;
      if (!user) {
        return sendError(
          res,
          CONSTANT_LIST.STATUS_ERROR,
          CONSTANT_LIST.UNAUTHORIZED_REQUEST,
          "No user found"
        );
      }

      const token: string | undefined = req
        .header("Authorization")
        ?.replace("Bearer", "")
        .trim();

      const deleteUserFromLogin = await Login.findOneAndDelete({
        userId: user,
        accessToken: token,
      });
      if (deleteUserFromLogin) {
        return sendSuccess(
          res,
          CONSTANT_LIST.STATUS_SUCCESS,
          CONSTANT_LIST.STATUS_CODE_OK,
          "User has been logout successfully",
          {}
        );
      } else {
        return sendError(
          res,
          CONSTANT_LIST.STATUS_ERROR,
          CONSTANT_LIST.BAD_REQUEST,
          "Sorry the user can not be logout"
        );
      }
    } catch (err: any) {
      console.log(err);
      return sendError(
        res,
        CONSTANT_LIST.STATUS_ERROR,
        CONSTANT_LIST.INTERNAL_SERVER_ERROR,
        CONSTANT_LIST.INTERNAL_SERVER_ERROR_MESSAGE
      );
    }
  }
);
