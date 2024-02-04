import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserAdminDto } from './dto/create-user-admin-dto';
import { CreateUserByAdminDto } from './dto/create-user-by-admin-dto';
import { CreateBloggerDto } from 'src/blogger/dto/create-blogger.dto';
import { LoginUserDto } from './dto/login-user-dto';
import { AuthGuard } from '@nestjs/passport';
import { CheckApiKeyGuard } from './guards/check-api-key.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginUserDto : LoginUserDto ){
    return this.authService.loginUser(loginUserDto);
  }

  @Post('register-admin')
  @UseGuards(CheckApiKeyGuard)
  createAdminUser( @Body() createUserAdminDto : CreateUserAdminDto ){
    return this.authService.createAdminUser(createUserAdminDto);
  }

  // Proteger ruta
  @Post('register-by-admin')
  @UseGuards(CheckApiKeyGuard)
  createUser( @Body() createUserByAdminDto : CreateUserByAdminDto ){
    return this.authService.createUser(createUserByAdminDto);
  }

  @Post('register')
  createBlogger( @Body() createBloggerDto : CreateBloggerDto){
    return this.authService.createBlogger(createBloggerDto);
  }
}