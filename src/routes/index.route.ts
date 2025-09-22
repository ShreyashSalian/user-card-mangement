import express from "express";
import userRouter from "./user.route";
import authRouter from "./auth.route";
import cardTypeRouter from "./cardType.route";
import cardProviderRouter from "./cardProvider.route";
import cardRouter from "./card.route";

const indexRouter = express.Router();
indexRouter.use("/api/v1/users", userRouter);
indexRouter.use("/api/v1/auth", authRouter);
indexRouter.use("/api/v1/cardtype", cardTypeRouter);
indexRouter.use("/api/v1/cardProvider", cardProviderRouter);
indexRouter.use("/api/v1/cards", cardRouter);

indexRouter.get("/api/v1/", (req: express.Request, res: express.Response) => {
  res.status(200).json({ message: "The server is running properly." });
});

export default indexRouter;
