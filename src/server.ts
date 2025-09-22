import app from "./app";
import indexRouter from "./routes/index.route";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`The application is running on http://localhost:${PORT}`);
});

app.use(indexRouter);
