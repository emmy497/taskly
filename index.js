import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";
import sequelize from "./sequelize.js";
import authMiddleware from "./middleware/auth.js";
import taskRoute from "./routes/taskRoute.js";

import express from "express";
import authRoute from "./routes/authRoute.js";
import tagRoute from "./routes/tagRoute.js";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/task", taskRoute, tagRoute);


app.get("/getUserDetails", authMiddleware, async (req, res) => {
  const currentUserEmail = req.user.email;
  // Now you can fetch user or use currentUserId
  res.json({ message: "This is your profile", userEmail: currentUserEmail });
});

const PORT = process.env.PORT || 3000;

sequelize
  .sync()
  .then(() => {
    console.log("Database Synced");
  })
  .catch((err) => {
    console.log("Error syncing database: ", err);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
