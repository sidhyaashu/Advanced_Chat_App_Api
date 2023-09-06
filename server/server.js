/**IMPORT LIBERAI */
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";

/**IMPORT FILES */
import connectDB from "./config/db.js";
import userRouter from "./router/userR.js"

/**CONFIGARATIONS */
const app = express();
dotenv.config();
connectDB();

/**DOT ENV */
const PORT = process.env.PORT || 5000;

/**MIDDLEWARE */
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

/**END POINTS */
app.use('/api/user',userRouter)

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
