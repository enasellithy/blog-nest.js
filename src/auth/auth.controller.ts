import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./auth.guard";
import { LoginDTO, RegisterDTO } from "../users/user.dto";
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/singup')
  register(@Body(ValidationPipe) credentials: RegisterDTO) {
    return this.authService.register(credentials);
  }

  @Post('/login')
  login(@Body(ValidationPipe) credentials: LoginDTO) {
    return this.authService.login(credentials);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Req() req: any) {
    const user = req.user;
    console.log(user.email);
    return this.authService.getProfile(user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/logout') // Use POST for logout
  async logout(@Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    return this.authService.logout(token);
  }
}
