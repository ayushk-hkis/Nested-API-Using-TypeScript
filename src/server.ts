import express from "express";
import listRoutes from "./routes/lists";
import connection from "./db/config/config";
import { json, urlencoded } from "body-parser";
import cors from "cors";

const app = express();
const PORT = 5050;

app.use(cors());

app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/list", listRoutes);

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(500).json({ message: err.message });
  }
);

connection
  .sync()
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((err) => {
    console.log("Error", err);
  });

app.listen(PORT, () => {
  console.log(`App is running on port no. http://localhost:${PORT}/list.`);
});
