import express from "express";
import { asyncHandler, sendError, sendSuccess } from "../utils/function";
import { CardType } from "../models/cardType.model";
import { CONSTANT_LIST } from "../constants/global.constants";
import { Card } from "../models/card.model";
import { SearchBody } from "../helpers/User.helper";

export const addCardType = asyncHandler(
  async (
    req: express.Request<{}, {}, { name: string; cardType: string }>,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const { name, cardType } = req.body;
      const cardAlreadyExist = await CardType.findOne({ name });
      if (cardAlreadyExist) {
        return sendError(
          res,
          CONSTANT_LIST.STATUS_ERROR,
          CONSTANT_LIST.BAD_REQUEST,
          "The given name for card already exist"
        );
      }
      const cardTypeCreation = await CardType.create({
        name,
        cardType,
      });
      if (cardTypeCreation) {
        return sendSuccess(
          res,
          CONSTANT_LIST.STATUS_SUCCESS,
          201,
          "The card type has been created successfully",
          cardTypeCreation
        );
      }
      return sendError(
        res,
        CONSTANT_LIST.STATUS_ERROR,
        CONSTANT_LIST.BAD_REQUEST,
        "Sorry, the card type can not be created."
      );
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

export const softDeleteCardType = asyncHandler(
  async (
    req: express.Request<{ cardTypeId: string }, {}, {}>,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const cardTypeId = req.params.cardTypeId;
      const cardTypeDetail = await CardType.findById(cardTypeId);
      if (!cardTypeDetail) {
        return sendError(
          res,
          CONSTANT_LIST.STATUS_ERROR,
          CONSTANT_LIST.BAD_REQUEST,
          "Sorry card type doesnt exit"
        );
      }
      const softtDeleteCardTypeById = await CardType.findByIdAndUpdate(
        cardTypeId,
        {
          $set: {
            isDeleted: true,
          },
        }
      );
      if (softtDeleteCardTypeById) {
        return sendSuccess(
          res,
          CONSTANT_LIST.STATUS_SUCCESS,
          CONSTANT_LIST.STATUS_CODE_OK,
          "The card type has been deleted successfully.",
          null
        );
      } else {
        return sendError(
          res,
          CONSTANT_LIST.STATUS_ERROR,
          CONSTANT_LIST.BAD_REQUEST,
          "Sorry, the card type can not be deleted."
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

export const updateCardType = asyncHandler(
  async (
    req: express.Request<
      { cardTypeId: string },
      {},
      { name: string; cardType: string }
    >,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const cardTypeId = req.params.cardTypeId;
      const { name, cardType } = req.body;
      const existingCardType = await CardType.findOne({
        name: name,
        _id: { $ne: cardTypeId }, // exclude current ID
      });
      if (existingCardType) {
        return sendError(
          res,
          CONSTANT_LIST.STATUS_ERROR,
          CONSTANT_LIST.BAD_REQUEST,
          "The name already existed for the card"
        );
      }
      const updateCardType = await CardType.findByIdAndUpdate(
        cardTypeId,
        {
          $set: {
            name,
            cardType,
          },
        },
        {
          new: true,
        }
      );
      if (updateCardType) {
        return sendSuccess(
          res,
          CONSTANT_LIST.STATUS_SUCCESS,
          CONSTANT_LIST.STATUS_CODE_OK,
          "The card type name has been updated",
          updateCardType
        );
      } else {
        return sendError(
          res,
          CONSTANT_LIST.STATUS_ERROR,
          CONSTANT_LIST.BAD_REQUEST,
          "Sorry, the name for the card type can not be updated."
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
export const listAllCardType = asyncHandler(
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
      console.log(search);

      // Search filter
      const searchFilter = search
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { cardType: { $regex: search, $options: "i" } },
            ],
          }
        : {};

      const matchStage = {
        ...searchFilter,
        isDeleted: false,
      };

      // Get paginated results
      const cardTypeDetail = await CardType.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder } },
        { $skip: skip },
        { $limit: limit },
      ]);

      // Get total count
      const totalCardType = await CardType.countDocuments(matchStage);

      if (cardTypeDetail.length === 0) {
        return sendError(
          res,
          CONSTANT_LIST.STATUS_ERROR,
          CONSTANT_LIST.NO_DATA_FOUND,
          "No card type found"
        );
      }

      const responsePayload = {
        cardTypeDetail,
        total: totalCardType,
        page,
        limit,
        totalPages: Math.ceil(totalCardType / limit),
      };

      return sendSuccess(
        res,
        CONSTANT_LIST.STATUS_SUCCESS,
        CONSTANT_LIST.STATUS_CODE_OK,
        "Card type detail",
        responsePayload
      );
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

export const getCardTypeById = asyncHandler(
  async (
    req: express.Request<{ cardTypeId: string }, {}, {}>,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const cardTypeId = req.params.cardTypeId;
      const cardTypeDetail = await CardType.findById(cardTypeId);
      if (!cardTypeDetail) {
        return sendError(
          res,
          CONSTANT_LIST.STATUS_ERROR,
          CONSTANT_LIST.BAD_REQUEST,
          "Sorry card type doesnt exit"
        );
      } else {
        return sendSuccess(
          res,
          CONSTANT_LIST.STATUS_SUCCESS,
          CONSTANT_LIST.STATUS_CODE_OK,
          "The card type",
          cardTypeDetail
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
