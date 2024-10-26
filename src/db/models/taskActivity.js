const { Model, DataTypes } = require('sequelize');

class TaskActivity extends Model {
  static associate(models) {
    this.belongsTo(models.Task, { foreignKey: 'taskId' });
  }
}

const initTaskActivityModel = (sequelize) => {
  TaskActivity.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Tasks',
          key: 'id',
        },
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      lastPausedTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      consumedTime: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
      },
      status: { // Add this field
        type: DataTypes.ENUM('todo', 'inProgress', 'paused', 'completed'),
        defaultValue: 'todo',
      },
    },
    {
      sequelize,
      modelName: 'TaskActivity',
    }
  );

  return TaskActivity; // Return the TaskActivity model
};

module.exports = initTaskActivityModel;
