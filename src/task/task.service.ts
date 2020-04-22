import { DeleteResult } from 'typeorm';

import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../user/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filters.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService {
  private logger = new Logger('TaskService');

  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async findAll(user: User, filtersDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filtersDto;
    return this.taskRepository.search(user.id, status, search);
  }

  async findOne(user: User, id: number): Promise<Task> {
    const task: Task = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    delete task.user;
    return task;
  }

  async createTask(user: User, createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    let task: Task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    task = await this.taskRepository.save(task);

    delete task.user;
    return task;
  }

  async updateTaskStatus(
    user: User,
    id: number,
    taskStatus: TaskStatus,
  ): Promise<Task> {
    let task: Task = await this.findOne(user, id);

    task.status = taskStatus;
    this.logger.debug(`Updating task ${id} status: ${taskStatus}`);
    task = await this.taskRepository.save(task);

    delete task.user;
    return task;
  }

  async delete(user: User, id: number): Promise<void> {
    const result: DeleteResult = await this.taskRepository.delete({
      id,
      userId: user.id,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}
