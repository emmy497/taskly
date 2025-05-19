import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";
import User from "./User.js";

const Tag = sequelize.define("Tag", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

Tag.associate = (models) => {
  Tag.hasMany(models.Task, {
    foreignKey: "tagId",
  });
};

export default Tag;
