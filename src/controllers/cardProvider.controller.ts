import express from "express";
import { CardProvider } from "../models/cardProvider";
import { asyncHandler, sendError, sendSuccess } from "../utils/function";
import { CONSTANT_LIST } from "../constants/global.constants";
import { SearchBody } from "../helpers/User.helper";
export const addCardProvider = asyncHandler(
  async (
    req: express.Request<{}, {}, { name: string }>,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const name = req.body.name;
      const CardProviderAlreadyExit = await CardProvider.findOne({ name });
      if (CardProviderAlreadyExit) {
        return sendError(
          res,
          CONSTANT_LIST.STATUS_ERROR,
          CONSTANT_LIST.BAD_REQUEST,
          "The given name for card provider already exist"
        );
      }
      const CardProviderCreation = await CardProvider.create({
        name,
      });
      if (CardProviderCreation) {
        return sendSuccess(
          res,
          CONSTANT_LIST.STATUS_SUCCESS,
          201,
          "The card provider has been created successfully",
          CardProviderCreation
        );
      }
      return sendError(
        res,
        CONSTANT_LIST.STATUS_ERROR,
        CONSTANT_LIST.BAD_REQUEST,
        "Sorry, the card provider can not be created."
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

export const softDeleteCardProvider = asyncHandler(
  async (
    req: express.Request<{ cardTypeId: string }, {}, {}>,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const cardTypeId = req.params.cardTypeId;
      const cardProviderDetail = await CardProvider.findById(cardTypeId);
      if (!cardProviderDetail) {
        return sendError(
          res,
          CONSTANT_LIST.STATUS_ERROR,
          CONSTANT_LIST.BAD_REQUEST,
          "Sorry card provider doesnt exit"
        );
      }
      const softtDeleteCardTypeById = await CardProvider.findByIdAndUpdate(
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
          "The card provider has been deleted successfully.",
          null
        );
      } else {
        return sendError(
          res,
          CONSTANT_LIST.STATUS_ERROR,
          CONSTANT_LIST.BAD_REQUEST,
          "Sorry, the card provider can not be deleted."
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
export const updateCardProvider = asyncHandler(
  async (
    req: express.Request<{ cardTypeId: string }, {}, { name: string }>,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const cardTypeId = req.params.cardTypeId;
      const name = req.body.name;
      const existingCardProvider = await CardProvider.findOne({
        name: name,
        _id: { $ne: cardTypeId }, // exclude current ID
      });
      if (existingCardProvider) {
        return sendError(
          res,
          CONSTANT_LIST.STATUS_ERROR,
          CONSTANT_LIST.BAD_REQUEST,
          "The name already existed for the card provider"
        );
      }
      const updateCardType = await CardProvider.findByIdAndUpdate(cardTypeId, {
        $set: {
          name,
        },
      });
      if (updateCardType) {
        return sendSuccess(
          res,
          CONSTANT_LIST.STATUS_SUCCESS,
          CONSTANT_LIST.STATUS_CODE_OK,
          "The card provider name has been updated",
          updateCardType
        );
      } else {
        return sendError(
          res,
          CONSTANT_LIST.STATUS_ERROR,
          CONSTANT_LIST.BAD_REQUEST,
          "Sorry, the name for the card provider can not be updated."
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
export const listAllCardProvider = asyncHandler(
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

      const searchFilter = search
        ? {
            name: { regex: search, $options: "i" },
          }
        : {};
      const matchStage = {
        ...searchFilter,
        isDeleted: false,
      };
      const cardTypeDetail = await CardProvider.aggregate([
        {
          $match: matchStage,
        },
        {
          $sort: {
            [sortBy]: sortOrder,
          },
        },
        {
          $limit: limit,
        },
        {
          $skip: skip,
        },
      ]);
      const totalCardType = await CardProvider.countDocuments(matchStage);
      if (cardTypeDetail.length === 0) {
        return sendError(
          res,
          CONSTANT_LIST.STATUS_ERROR,
          CONSTANT_LIST.BAD_REQUEST,
          "No card provider found"
        );
      } else {
        const responsePayload = {
          totalCardType,
          page,
          limit,
          total: totalCardType,
          totalPage: Math.ceil(totalCardType / limit),
        };
        return sendSuccess(
          res,
          CONSTANT_LIST.STATUS_SUCCESS,
          CONSTANT_LIST.STATUS_CODE_OK,
          "Card provider detail",
          responsePayload
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
export const getCardProviderById = asyncHandler(
  async (
    req: express.Request<{ cardProviderId: string }, {}, {}>,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const cardProviderId = req.params.cardProviderId;
      const cardProviderDetail = await CardProvider.findById(cardProviderId);
      if (!cardProviderDetail) {
        return sendError(
          res,
          CONSTANT_LIST.STATUS_ERROR,
          CONSTANT_LIST.BAD_REQUEST,
          "Sorry card provider doesnt exit"
        );
      } else {
        return sendSuccess(
          res,
          CONSTANT_LIST.STATUS_SUCCESS,
          CONSTANT_LIST.STATUS_CODE_OK,
          "The card provider",
          cardProviderDetail
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
