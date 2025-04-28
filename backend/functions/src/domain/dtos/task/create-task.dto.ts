export interface CreateTaskDto {
    userId: string;
    title: string;
    description: string;
    completed: boolean;
}