import { Router, Request, Response } from 'express';
import { body, param } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';
import { Task } from '../models/Task';
import { parseTasks } from '../services/openai';

const router = Router();

// Get all tasks
router.get('/', async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a task
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('quadrant')
      .isIn(['important-urgent', 'important-not-urgent', 'not-important-urgent', 'not-important-not-urgent'])
      .withMessage('Invalid quadrant'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body);
      await task.save();
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update a task
router.patch(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task ID'),
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('completed').optional().isBoolean().withMessage('Completed must be a boolean'),
    body('quadrant')
      .optional()
      .isIn(['important-urgent', 'important-not-urgent', 'not-important-urgent', 'not-important-not-urgent'])
      .withMessage('Invalid quadrant'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete a task
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid task ID')],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Parse and create tasks from text
router.post(
  '/parse',
  [
    body('text').trim().notEmpty().withMessage('Text is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const parsedTasks = await parseTasks(req.body.text);
      
      // Create all tasks
      const createdTasks = await Promise.all(
        parsedTasks.map(taskData => {
          const task = new Task({
            title: taskData.title,
            quadrant: taskData.quadrant || 'important-urgent',
            completed: false,
          });
          return task.save();
        })
      );

      res.status(201).json(createdTasks);
    } catch (error) {
      console.error('Failed to parse tasks:', error);
      res.status(500).json({ message: 'Failed to parse and create tasks' });
    }
  }
);

export default router;