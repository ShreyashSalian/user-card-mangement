import app from "./app";
import { connectDB } from "./config/database";
import indexRouter from "./routes/index.route";

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`The application is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Error while connecting to the database : ${err}`);
  });

app.use(indexRouter);
