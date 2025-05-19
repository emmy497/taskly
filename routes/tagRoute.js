import jwt from "jsonwebtoken";
import express from "express";
const router = express.Router();
import dotenv from "dotenv";
import User from "../models/User.js";
import bcrypt from "bcrypt";
dotenv.config();
import authMiddleware from "../middleware/auth.js";
import Task from "../models/Task.js";
import Tag from "../models/Tag.js";

// POST /api/tasks/:taskId/tag
router.post("/:taskId/tag", authMiddleware, async (req, res) => {
  const { tag } = req.body; 

  try {
    const task = await Task.findByPk(req.params.taskId);
    // console.log(task)
    if (!task) return res.status(404).json({ error: "Task not found" });


  
    const [tagInstance] = await Tag.findOrCreate({ where: { name: tag } });

    task.tagId = tagInstance.id;
    // console.log(task.tagId);
    await task.save();

    return res.json({ message: "Tag assigned to task", tag: tagInstance });
  } catch (err) {
    console.error("Error assigning tag:", err);
    res.status(500).json({ error: "Server error while assigning tag" });
  }
});

export default router;
