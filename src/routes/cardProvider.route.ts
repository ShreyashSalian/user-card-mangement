import express from "express";
import { checkAdmin, verifyUser } from "../middlewares/auth.middleware";
import { CardProviderValidation } from "../validations/cardProvider.validation";
import { validateAPI } from "../middlewares/validate.middleware";
import {
  addCardProvider,
  getCardProviderById,
  listAllCardProvider,
  softDeleteCardProvider,
  updateCardProvider,
} from "../controllers/cardProvider.controller";

const cardProviderRouter = express.Router();

cardProviderRouter.post(
  "/",
  verifyUser,
  checkAdmin,
  CardProviderValidation(),
  validateAPI,
  addCardProvider
);
cardProviderRouter.get(
  "/:cardProviderId",
  verifyUser,
  checkAdmin,
  getCardProviderById
);
cardProviderRouter.put(
  "/:cardProviderId",
  verifyUser,
  checkAdmin,
  updateCardProvider
);

cardProviderRouter.post(
  "/:cardProviderId",
  verifyUser,
  checkAdmin,
  softDeleteCardProvider
);
cardProviderRouter.post("/search", verifyUser, checkAdmin, listAllCardProvider);

export default cardProviderRouter;
