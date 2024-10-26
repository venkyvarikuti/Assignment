const { sequelize } = require('../db/models');
const initTaskActivityModel = require('../db/models/taskActivity');
const TaskActivity = initTaskActivityModel(sequelize);

const TaskStatus = {
    TODO:"todo",
    IN_PROGRESS: "inProgress",
    COMPLETED :"completed",
    PAUSED: "paused",
}

class TaskActivityController {
    /**
     * Updates the TaskActivity based on the new task status.
     * @param {number} taskId - ID of the task.
     * @param {string} newStatus - New status of the task.
     */
    static async updateTaskActivity(taskId, newStatus) {
      const currentTime = new Date();
  
      try {
        const taskActivity = await TaskActivity.findOne({ where: { taskId} });
        if (!taskActivity) {
          console.log(`TaskActivity with task_id ${taskId} not found.`);
          return;
        }
  
        let updatedFields = {};
  
        switch (newStatus) {
          case TaskStatus.IN_PROGRESS:
            if (taskActivity.status === TaskStatus.PAUSED) {
              updatedFields = {
                status: TaskStatus.IN_PROGRESS,
                lastPausedTime: currentTime,
              };
            } else if (taskActivity.status === TaskStatus.TODO) {
              updatedFields = {
                status: TaskStatus.IN_PROGRESS,
                startTime: currentTime,
                lastPausedTime: currentTime,
              };
            }
            break;
  
          case TaskStatus.PAUSED:
            if (taskActivity.status === TaskStatus.IN_PROGRESS) {
              const consumedTime =
                ( currentTime - taskActivity.lastPausedTime ) / 1000;
              updatedFields = {
                status: TaskStatus.PAUSED,
                consumedTime: (taskActivity.consumedTime || 0) + Math.floor(consumedTime),
              };
            }
            break;
            
          case TaskStatus.COMPLETED:
            if (taskActivity.status === TaskStatus.IN_PROGRESS) {
              const consumedTime =
                (currentTime - new Date(taskActivity.lastPausedTime || currentTime)) / 1000;
              updatedFields = {
                status: TaskStatus.COMPLETED,
                endTime: currentTime,
                consumedTime: (taskActivity.consumedTime || 0) + Math.floor(consumedTime),
              };
            }
            break;
  
          default:
            return;
        }
  
        await TaskActivity.update(updatedFields, { where: {taskId } });
  
      } catch (error) {
        console.error("Error updating task activity:", error);
        throw new Error("Internal server error");
      }
    }

    static async createTaskActivity(taskId) {
        try {
          await TaskActivity.create({ taskId});
        } catch (error) {
          res.status(500).json({ error: 'Failed to create task activity' });
        }
      }
      static async getTaskActivityById(taskId) {
        try {
          const taskActivity = await TaskActivity.findOne({ where: {taskId } });
          if (!taskActivity) {
            return res.status(404).json({ error: 'Task activity not found' });
          }
          return taskActivity;
        } catch (error) {
          res.status(500).json({ error: 'Failed to fetch task' });
        }
      }
    
  }
  

module.exports = TaskActivityController;
