import express from "express";
import "express-async-errors";
import cors from "cors";
import dotenv from "dotenv";

import boards from "./board";
import auth from "./auth";
import confession from "./confession";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/boards", boards);
app.use("/auth", auth);
app.use("/confessions", confession);

app.listen(3000, () => {
  console.log("Listening at port 3000...");
});
