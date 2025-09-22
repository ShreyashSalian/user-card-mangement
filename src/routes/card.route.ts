import express from "express";
import { verifyUser } from "../middlewares/auth.middleware";
import { CardValidation } from "../validations/cardValidation";
import { validateAPI } from "../middlewares/validate.middleware";
import { addCard, listAllCard } from "../controllers/card.controller";

const cardRouter = express.Router();

cardRouter.post("/", verifyUser, CardValidation(), validateAPI, addCard);

cardRouter.post("/search", verifyUser, listAllCard);

export default cardRouter;
