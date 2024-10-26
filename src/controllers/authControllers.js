const { sequelize } = require('../db/models');
const initUserModel = require('../db/models/user');
const User = initUserModel(sequelize);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class AuthController {
  static async register(req, res) {
    try {
      const { username, password, email } = req.body;

      //userName and userEmail should be unique
      const userName = await User.findOne({ where: { username } });
      const userEmail = await User.findOne({ where: { username } });

      //verification of userName and userEmail
      if(userName) return res.status(400).json({ error: 'user name already exists' });
      if(userEmail) return res.status(400).json({ error: 'email in use' });
      
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
      const user = await User.create({ username, password: hashedPassword, email });
      
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      res.status(201).json({ user: { ...user.toJSON(), password: undefined }, token }); // Remove password from user response
    } catch (error) {
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  static async login(req, res) {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Compare the hashed password with the entered password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      res.json({ user: { ...user.toJSON(), password: undefined }, token }); // Remove password from user response
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  }

  static logout(req, res) {
    // Clear the token from the client-side or session store as needed.
    res.json({ message: 'Logout successful' });
  }
}

module.exports = AuthController;


