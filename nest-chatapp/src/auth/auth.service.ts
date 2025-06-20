import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly saltOrRounds = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return null;
    }

    const verified = await bcrypt.compare(password, user.password);

    if (!verified) {
      return null;
    }

    return user;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async login(user: User) {
    return {
      status: HttpStatus.OK,
      message: 'Login successful',
      access_token: this.jwtService.sign(user),
    };
  }

  public async register(registerDto: RegisterDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (user) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      this.saltOrRounds,
    );

    const createdUser = await this.prisma.user.create({
      data: {
        username: registerDto.username,
        email: registerDto.email,
        password: hashedPassword,
      },
    });

    return {
      status: HttpStatus.CREATED,
      message: 'User created successfully',
      user: createdUser,
    };
  }
}
