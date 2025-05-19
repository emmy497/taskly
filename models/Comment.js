import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";
import User from "./User.js";

const Comment = sequelize.define("Comment", {
  content: DataTypes.STRING,
});

Comment.belongsTo(User);
Comment.belongsTo(Task);

export default Comment;
