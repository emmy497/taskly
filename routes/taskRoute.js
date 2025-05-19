import jwt from "jsonwebtoken";
import express from "express";
const router = express.Router();
import dotenv from "dotenv";
import User from "../models/User.js";
import bcrypt from "bcrypt";
dotenv.config();
import authMiddleware from "../middleware/auth.js";
import Task from "../models/Task.js";

import {
  loginValidationSchema,
  taskValidationSchema,
  registerValidationSchema,
} from "../utils/validators.js";

router.post("/createTask", authMiddleware, async (req, res) => {
  try {
    const { title, description, dueDate, status, assignedToId } = req.body;

    const { email: userEmail } = req.user;

    console.log(userEmail);

    const { error } = taskValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    console.log(req.user);

    const assignedUserId = assignedToId || req.user.id;

    const userExists = await User.findByPk(assignedUserId);
    if (!userExists) {
      return res.status(400).json({ error: "Assigned user does not exist" });
    }

    const newTask = await Task.create({
      title,
      description,
      dueDate,
      status,
      createdBy: userEmail,
      assignedToId: assignedUserId,
    });

    return res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (err) {
    res.status(500).json({ error: "Errorr creating task" });
  }
});

router.post("/updateStatus/:id", authMiddleware, async (req, res) => {
  try {
    // console.log(req.user)
    const { status } = req.body;
    const taskId = req.params.id;

    if (!["pending", "in-progress", "completed"].includes(status)) {
      return res.status(400).json({ error: "Invalid value for status" });
    }

    const task = await Task.findByPk(taskId);
    console.log("user role " + req.user.role);
    if (!task) return res.status(404).json({ error: "Task not found" });


    const userId = req.user.id
    const user = await User.findByPk(userId)
    // console.log(user)
   

    if (user.role !== "admin" && req.user.id !== task.dataValues.assignedToId) {
      return res
        .status(403)
        .json({ error: "You are not allowed to update this task." });
    }

    task.status = status;
    await task.save();

    return res.json({ message: "Task status has been updated", task });
  } catch (err) {
    console.error("Error updating task status:", err);
    res.status(500).json({ error: "Server error while updating task status." });
  }
});

export default router;
