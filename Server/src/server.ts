import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import InitiateMongoServer from "./db";
import { PORT, WEB_URL } from "./config";
import userRouter from "./routes/user";
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

InitiateMongoServer();

const app: Express = express();
const port = PORT || 8080;

app.use(
  cors({
    origin: [WEB_URL || "http://localhost:5173"],
  })
);

app.set("trust proxy", "loopback, linklocal, uniquelocal");
app.use(limiter);

app.use(express.json({ limit: "100kb" }));

app.use("/user", userRouter);

app.use("*path", (req: Request, res: Response, next: NextFunction) => {
  const error = {
    status: 404,
    message: "Api endpoint does not found",
  };
  next(error);
});

try {
  app.listen(port, () => {
    console.log(`${port}`);
  });
} catch (error) {
  console.error("Error starting server:", JSON.stringify(error));
  process.exit(1);
}
