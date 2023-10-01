/**IMPORT LIBERAI */
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";

/**IMPORT FILES */
import connectDB from "./config/db.js";
import userRouter from "./router/userR.js"
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import chatRoutes from "./router/chatR.js";

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
app.use('/api/chat',chatRoutes)

/**Middleware for error handling */
app.use(notFound)
app.use(errorHandler)

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
