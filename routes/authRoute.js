import jwt from "jsonwebtoken";
import express from "express";
const router = express.Router();
import dotenv from "dotenv";
import User from "../models/User.js";
import bcrypt from "bcrypt";
dotenv.config();

import {
  loginValidationSchema,
  taskValidationSchema,
  registerValidationSchema,
} from "../utils/validators.js";

router.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password, role } = req.body;

    const { error } = registerValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role,
    });

    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ error: "Errorrr registering user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { error, value } = loginValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: value.email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(value.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Login successful", token });
    console.log(token);
  } catch (err) {
    res.status(500).json({ error: "Error logging in" });
  }
});

export default router;
