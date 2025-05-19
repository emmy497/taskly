import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";
import User from "./User.js";

const Task = sequelize.define("Task", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "in-progress", "completed"),
    defaultValue: "pending",
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.STRING,
  },
  assignedToId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
});

Task.belongsTo(User, { as: "assignedTo", foreignKey: "assignedToId" });

export default Task;
