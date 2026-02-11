const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routers/auth");
const SERVER_PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

const DB_CONNECTION =
  "mongodb+srv://root:u7pN5ULlW9ECVxDC@comp3133.zktncae.mongodb.net/labtest1";

mongoose
  .connect(DB_CONNECTION)
  .then((success) => {
    console.log("Success Mongodb connection");
  })
  .catch((err) => {
    console.log("Error Mongodb connection");
  });

app.use("/api/v1/auth", authRouter);

app.listen(SERVER_PORT, () => {
  console.log("Server is running...");
});
