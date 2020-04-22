import { EntityRepository, Repository } from 'typeorm';

import { InternalServerErrorException } from '@nestjs/common';

import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async search(
    userId: number,
    status: TaskStatus,
    search: string,
  ): Promise<Task[]> {
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      //this.logger.error(`Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`, error.stack);
      throw new InternalServerErrorException();
    }
  }
}
