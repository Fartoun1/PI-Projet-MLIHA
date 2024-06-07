import express from "express";
import mongoose from "mongoose";
import indexRoutes from "./routes/routes.js";
import { notFoundError, errorHandler } from "./middlewares/error-handler.js";
const app = express();
const port = process.env.PORT || 9090;
const databaseName = "E-MLIHA";

mongoose.set("debug", true);
mongoose.Promise = global.Promise;

mongoose
  .connect(`mongodb://127.0.0.1:27017/${databaseName}`)
  .then(() => console.log(`Connected to ${databaseName}`))
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());
app.use(indexRoutes);
app.use(notFoundError);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});
