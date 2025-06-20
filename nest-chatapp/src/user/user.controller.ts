import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRequest } from 'src/types/globalTypes';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-profile')
  public findOne(@Request() req: UserRequest) {
    return this.userService.findOne(req.user);
  }
}
