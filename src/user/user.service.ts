import { Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(
    username: string,
    firstName: string,
    lastName: string,
    password: string,
  ): Promise<User> {
    let user = this.userRepository.create({
      username,
      firstName,
      lastName,
    });
    await user.setPassword(password);

    try {
      user = await this.userRepository.save(user);
      return user;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // duplicate username
        throw new ConflictException(`Username "${username}" already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ username });
  }
}
