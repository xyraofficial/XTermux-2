import express from "express";
import { storage } from "./storage";
import { registerRoutes } from "./routes";

const app = express();
app.use(express.json());

registerRoutes(app);

const PORT = 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Backend listening on port " + PORT);
});
