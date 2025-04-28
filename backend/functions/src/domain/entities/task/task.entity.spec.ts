import { Task } from '../../../domain/entities/task/task.entity';

describe('Task Entity', () => {
    it('should create a task instance with all properties', () => {
        const id = 'task-123';
        const userId = 'user-456';
        const title = 'Test Task';
        const description = 'This is a test task';
        const completed = false;
        const createdAt = new Date();

        const task = new Task(id, userId, title, description, completed, createdAt);

        expect(task).toBeInstanceOf(Task);
        expect(task.id).toBe(id);
        expect(task.userId).toBe(userId);
        expect(task.title).toBe(title);
        expect(task.description).toBe(description);
        expect(task.completed).toBe(completed);
        expect(task.createdAt).toBe(createdAt);
    });

    it('should create a completed task correctly', () => {
        const id = 'task-123';
        const userId = 'user-456';
        const title = 'Completed Task';
        const description = 'This is a completed task';
        const completed = true;
        const createdAt = new Date();

        const task = new Task(id, userId, title, description, completed, createdAt);

        expect(task.completed).toBe(true);
    });

    it('should handle date objects properly', () => {
        const id = 'task-123';
        const userId = 'user-456';
        const title = 'Test Task';
        const description = 'Testing date handling';
        const completed = false;
        const createdAt = new Date('2023-01-01T12:00:00Z');

        const task = new Task(id, userId, title, description, completed, createdAt);

        expect(task.createdAt).toEqual(new Date('2023-01-01T12:00:00Z'));
    });
});