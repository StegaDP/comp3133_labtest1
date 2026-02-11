const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routers/auth");
const roomRouter = require("./routers/rooms");
const SERVER_PORT = process.env.PORT || 3000;
const seedRooms = require("./roomsseed");
const expressWs = require("express-ws");
const jwt = require("jsonwebtoken");
const groupMessageModel = require("./models/groupmsgs");

process.env.JWT_SECRET = "canthackthissecretitstoolongtocrack";

const app = express();
app.use(express.json());
expressWs(app);

const DB_CONNECTION =
  "mongodb+srv://root:u7pN5ULlW9ECVxDC@comp3133.zktncae.mongodb.net/labtest1";

mongoose
  .connect(DB_CONNECTION)
  .then((success) => {
    seedRooms();
    console.log("Success Mongodb connection");
  })
  .catch((err) => {
    console.log("Error Mongodb connection");
  });

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/rooms", roomRouter);

app.ws("/ws", (ws, req) => {
  ws.user = null;

  ws.send("connected");

  ws.on("message", async (msg) => {
    const data = JSON.parse(msg);
    const { action } = data;

    if (action === "ping") {
      ws.send(`pong`);
    } else if (action === "auth") {
      const { token } = data;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      ws.user = decoded;
      ws.send(JSON.stringify({ status: "success", ...decoded }));
    } else if (action === "message") {
      if (!ws.user) {
        ws.send(JSON.stringify({ status: "error", message: "Unauthorized" }));
      } else {
        const newMessage = new groupMessageModel({
          from_user: ws.user.id,
          message: data.message,
          room: data.room,
          date_sent: new Date(),
        });

        await newMessage.save();
        ws.send(JSON.stringify({ status: "success", message: "Message sent" }));
      }
    } else {
      ws.send(`echo: ${msg}`);
    }
  });

  ws.on("close", () => {});
});

app.listen(SERVER_PORT, () => {
  console.log("Server is running...");
});
