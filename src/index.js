import express from "express";
import bodyParser from "body-parser";
import router from "./routes/index.js";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.send("Hello World");
});
app.use("/", router);

const sequelize = new Sequelize(process.env.DATABASE_URL, { logging: false });

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to PostgreSQL");
    app.listen(PORT, () => {
      console.log(`Server is running on http://${HOST}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
