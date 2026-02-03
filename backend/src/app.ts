import express from "express";
import cors from "cors";
import helmet from "helmet";

import routes from "./routes";
import { notFound } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

// --- Global middlewares ---
app.use(helmet());
app.use(cors());
app.use(express.json());

// --- Routes ---
app.use("/api", routes);

// --- Errors ---
app.use(notFound);
app.use(errorHandler);

export default app;
