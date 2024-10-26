const { Model, DataTypes } = require('sequelize');

class Task extends Model {
  static associate(models) {
    this.belongsTo(models.User);
  }
}

const initTaskModel = (sequelize) => {
  Task.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('todo', 'inProgress', 'completed', 'paused'),
        defaultValue: 'todo',
      },
      userId: { // Assuming tasks are associated with users
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Name of the user model (make sure it's correct)
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Task',
    }
  );

  return Task; // Return the Task model
};

module.exports = initTaskModel;
