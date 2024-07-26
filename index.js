import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import http from "http";

import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import { Server } from "socket.io";

dotenv.config();
const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "https://besthy-fe.vercel.app",
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: "auto" },
  })
);

app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/message", messageRoute);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://besthy-fe.vercel.app",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.set("io", io);

server.listen(process.env.APP_PORT, () => {
  console.log(`Server running on port ${process.env.APP_PORT}`);
});
