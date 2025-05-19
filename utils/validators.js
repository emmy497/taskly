import joi from "joi";

export const registerValidationSchema = joi.object({
  firstname: joi.string().required(),
  lastname: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  role: joi.string().valid("admin", "user").optional(),
});

export const loginValidationSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

export const taskValidationSchema = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  dueDate: joi.date().required(),
  status: joi.string().valid("pending", "in-progress", "completed").optional(),
  createdBy: joi.string().optional(),
  assignedToId: joi.number().integer().optional(),
});

const commentValidationSchema = joi.object({
  content: joi.string().required(),
});
