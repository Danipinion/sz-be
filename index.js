import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import messageRoute from "./routes/message.route.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use("/message", messageRoute);

app.listen(process.env.APP_PORT, () => {
  console.log(`Server running on port ${process.env.APP_PORT}`);
});
