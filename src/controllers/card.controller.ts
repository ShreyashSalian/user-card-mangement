import express from "express";
import {
  asyncHandler,
  secureRandomDigits,
  sendError,
  sendSuccess,
} from "../utils/function";
import { CONSTANT_LIST } from "../constants/global.constants";
import { CardBody } from "../helpers/Card.helper";
import mongoose from "mongoose";
import { User } from "../models/user.model";
import { CardType } from "../models/cardType.model";
import { Card } from "../models/card.model";
import { CardProvider } from "../models/cardProvider";
import { SearchBody } from "../helpers/User.helper";

export const addCard = asyncHandler(
  async (
    req: express.Request<{}, {}, CardBody>,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const { userId, cardTypeId, cardProviderId } = req.body;
      const user = req.user?.userId;
      const userDetail = await User.findById(user);

      let assignedUserId: string | mongoose.Types.ObjectId =
        new mongoose.Types.ObjectId(user);

      if (userDetail?.role === "admin") {
        assignedUserId = userId;
      }

      const cardType = await CardType.findById(cardTypeId);
      console.log(cardType);
      if (!cardType) {
        return sendError(
          res,
          CONSTANT_LIST.STATUS_ERROR,
          CONSTANT_LIST.NO_DATA_FOUND,
          "Card type not found"
        );
      }
      const cardProvider = await CardProvider.findById(cardProviderId);
      if (!cardProvider) {
        return sendError(
          res,
          CONSTANT_LIST.STATUS_ERROR,
          CONSTANT_LIST.NO_DATA_FOUND,
          "Card provider not found"
        );
      }

      const existingCard = await Card.countDocuments({
        userId: assignedUserId,
        cardTypeId: cardTypeId,
      });

      if (cardType.cardType === "Virtual" && existingCard >= 3) {
        return sendError(
          res,
          CONSTANT_LIST.STATUS_ERROR,
          CONSTANT_LIST.BAD_REQUEST,
          "User can not jave more than 3 virtual card."
        );
      }
      if (cardType.cardType === "Physical" && existingCard >= 4) {
        return sendError(
          res,
          CONSTANT_LIST.STATUS_ERROR,
          CONSTANT_LIST.BAD_REQUEST,
          "User can not have more than 4 physical card"
        );
      }
      const cardCreation = await Card.create({
        userId: assignedUserId,
        cardTypeId,
        cardProviderId,
        cardNumber: secureRandomDigits(),
      });
      if (cardCreation) {
        return sendSuccess(
          res,
          CONSTANT_LIST.STATUS_SUCCESS,
          CONSTANT_LIST.STATUS_CODE_OK,
          "Card created successfully",
          cardCreation
        );
      } else {
        return sendError(
          res,
          CONSTANT_LIST.STATUS_ERROR,
          CONSTANT_LIST.BAD_REQUEST,
          "Sorry, the card can not be created."
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

export const listAllCard = asyncHandler(
  async (
    req: express.Request<{}, {}, SearchBody>,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const page = req.body.page || 1;
      const limit = req.body.limit || 10;
      const skip = (page - 1) * limit;
      const sortBy = req.body.sortBy || "createdAt";
      const sortOrder = req.body.sortOrder === "asc" ? 1 : -1;
      const search = req.body.search;

      const userDetail = await User.findById(req.user?.userId);

      // Build match stage
      const searchFilter = search
        ? { name: { $regex: search, $options: "i" } }
        : {};

      const matchStage = {
        ...(userDetail?.role === "admin" ? {} : { userId: req.user?.userId }),
        isDeleted: false,
        ...searchFilter,
      };

      // Aggregation pipeline
      const cardProviderDetail = await Card.aggregate([
        { $match: matchStage },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetail",
            pipeline: [
              {
                $project: {
                  userName: 1,
                  firstName: 1,
                  lastName: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "cardtypes",
            foreignField: "_id",
            localField: "cardTypeId",
            as: "cardTypeDetail",
          },
        },
        {
          $lookup: {
            from: "cardproviders",
            foreignField: "_id",
            localField: "cardProviderId",
            as: "cardProviderDetail",
          },
        },
        {
          $addFields: {
            userDetail: { $first: "$userDetail" },
            cardTypeDetail: { $first: "$cardTypeDetail" },
            cardProviderDetail: { $first: "$cardProviderDetail" },
          },
        },
        { $sort: { [sortBy]: sortOrder } },
        { $skip: skip },
        { $limit: limit },
      ]);

      // Total count for pagination
      const totalCardProvider = await CardProvider.countDocuments(matchStage);

      if (cardProviderDetail.length === 0) {
        return sendError(
          res,
          CONSTANT_LIST.STATUS_ERROR,
          CONSTANT_LIST.NO_DATA_FOUND,
          "No card provider found"
        );
      }

      return sendSuccess(
        res,
        CONSTANT_LIST.STATUS_SUCCESS,
        CONSTANT_LIST.STATUS_CODE_OK,
        "Card details",
        {
          cardProviderDetail,
          page,
          limit,
          total: totalCardProvider,
          totalPage: Math.ceil(totalCardProvider / limit),
        }
      );
    } catch (err: any) {
      console.error("Error in listAllCard:", err);
      return sendError(
        res,
        CONSTANT_LIST.STATUS_ERROR,
        CONSTANT_LIST.INTERNAL_SERVER_ERROR,
        CONSTANT_LIST.INTERNAL_SERVER_ERROR_MESSAGE
      );
    }
  }
);
