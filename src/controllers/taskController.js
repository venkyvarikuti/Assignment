const { sequelize } = require('../db/models');
const initTaskModel = require('../db/models/task');
const TaskActivityController = require('./taskActivityController');
const Task = initTaskModel(sequelize);

class TaskController {
  // Get all tasks for the authenticated user
  static async getAllTasks(req, res) {
    try {
      const tasks = await Task.findAll({ where: { userId: req.user.id } });
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  }

  // Create a new task
  static async createTask(req, res) {
    const { title, description } = req.body;
    try {
      const newTask = await Task.create({ title, description, userId: req.user.id });
      await TaskActivityController.createTaskActivity(newTask.id)
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create task' });
    }
  }

  // Get a task by ID
  static async getTaskById(req, res) {
    const { id } = req.params;
    try {
      const task = await Task.findOne({ where: { id, userId: req.user.id } });
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      const taskActivity = await TaskActivityController.getTaskActivityById(task.id)
      res.json({task, taskActivity});
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch task' });
    }
  }

  // Update a task
  static async updateTask(req, res) {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
      const task = await Task.findOne({ where: { id, userId: req.user.id } });
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      await task.update({ title, description, status });
      await TaskActivityController.updateTaskActivity(task.id, status);
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update task' });
    }
  }

  // Delete a task
  static async deleteTask(req, res) {
    const { id } = req.params;
    try {
      const task = await Task.findOne({ where: { id, userId: req.user.id } });
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      await task.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete task' });
    }
  }
}

module.exports = TaskController;
