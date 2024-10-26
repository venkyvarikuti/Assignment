const { Model, DataTypes } = require('sequelize');

class User extends Model {
  static associate(models) {
    this.hasMany(models.Task, { foreignKey: 'userId' });
  }
}

const initUserModel = (sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      // Add any additional fields as necessary
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User; // Return the User model
};

module.exports = initUserModel;
