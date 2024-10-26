const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', TaskController.getAllTasks);
router.post('/', TaskController.createTask);
router.get('/:id', TaskController.getTaskById);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

module.exports = router;
