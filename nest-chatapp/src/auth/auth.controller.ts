import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UserRequest } from 'src/types/globalTypes';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public login(@Request() req: UserRequest) {
    return this.authService.login(req.user);
  }

  @Post('register')
  public register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
