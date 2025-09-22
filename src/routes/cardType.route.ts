import express from "express";
import { checkAdmin, verifyUser } from "../middlewares/auth.middleware";
import { check } from "express-validator";
import { CardTypeValidation } from "../validations/cardType.validation";
import { validateAPI } from "../middlewares/validate.middleware";
import {
  addCardType,
  getCardTypeById,
  listAllCardType,
  softDeleteCardType,
  updateCardType,
} from "../controllers/cardType.controller";

const cardTypeRouter = express.Router();

cardTypeRouter.post(
  "/",
  verifyUser,
  checkAdmin,
  CardTypeValidation(),
  validateAPI,
  addCardType
);

cardTypeRouter.get("/:cardTypeId", verifyUser, checkAdmin, getCardTypeById);

cardTypeRouter.put(
  "/:cardTypeId",
  verifyUser,
  checkAdmin,
  CardTypeValidation(),
  validateAPI,
  updateCardType
);

cardTypeRouter.post("/:cardTypeId", verifyUser, checkAdmin, softDeleteCardType);

cardTypeRouter.post("/search", verifyUser, checkAdmin, listAllCardType);

export default cardTypeRouter;
