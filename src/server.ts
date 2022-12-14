import bodyParser from "body-parser";
import express from "express";
import cors from "cors";

import { helloRouter } from "./routes/hello";
import { getUsersRouter } from "./routes/getUsers";
import { getBalanceRouter } from "./routes/getBalance";
import { getTransactionsRouter } from "./routes/getTransactions";
import { postCashoutRouter } from "./routes/postCashout";
import { postUserRouter } from "./routes/postUsers";
import { postLoginRouter } from "./routes/postLogin";
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT || "5432")
});

const connectToDB = async () => {
  try {
    await pool.connect();
  } catch (err) {
    console.log(err);
  }
};

connectToDB();

const port = process.env.PORT || 3333;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(helloRouter);
app.use(getUsersRouter);
app.use(getBalanceRouter);
app.use(getTransactionsRouter);
app.use(postCashoutRouter);
app.use(postUserRouter);
app.use(postLoginRouter);

app.listen(port, () => {
  console.log("Online...");
});
