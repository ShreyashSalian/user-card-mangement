import express from "express";

const indexRouter = express.Router();

indexRouter.get("/api/v1/", (req: express.Request, res: express.Response) => {
  res.status(200).json({ message: "The server is running properly." });
});

export default indexRouter;
