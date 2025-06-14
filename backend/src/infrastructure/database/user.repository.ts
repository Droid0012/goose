import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'ADMIN' | 'PLAYER';
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.users.findUnique({
      where: { username },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.users.findUnique({
      where: { id },
    });
  }

  async create(
    username: string,
    password: string,
    role: 'ADMIN' | 'PLAYER' = 'PLAYER',
  ): Promise<User> {
    return this.prisma.users.create({
      data: {
        username,
        password,
        role,
      },
    });
  }

  async findOrCreate(
    username: string,
    password: string,
    role: 'ADMIN' | 'PLAYER' = 'PLAYER',
  ): Promise<User> {
    const existingUser = await this.findByUsername(username);
    if (existingUser) {
      return existingUser;
    }
    return this.create(username, password, role);
  }
}
