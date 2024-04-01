const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Department extends Model { }
//defining our department model 
Department.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: "department",
    }
);

module.exports = Department;