import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll() {
    const users: User[] = await this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      status: HttpStatus.OK,
      message: 'Users fetched successfully',
      users,
    };
  }

  public async findOne(user: User) {
    const userFound = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userFound) {
      throw new NotFoundException('User not found');
    }

    return {
      status: HttpStatus.OK,
      message: 'User fetched successfully',
      user: userFound,
    };
  }
}
