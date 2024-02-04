import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserAdminDto } from './dto/create-user-admin-dto';
import { CreateUserByAdminDto } from './dto/create-user-by-admin-dto';
import { CreateBloggerDto } from 'src/blogger/dto/create-blogger.dto';
import { LoginUserDto } from './dto/login-user-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginUserDto : LoginUserDto ){
    return this.authService.loginUser(loginUserDto);
  }

  // Proteger ruta
  @Post('register-admin')
  createAdminUser( @Body() createUserAdminDto : CreateUserAdminDto ){
    return this.authService.createAdminUser(createUserAdminDto);
  }

  // Proteger ruta
  @Post('register-by-admin')
  createUser( @Body() createUserByAdminDto : CreateUserByAdminDto ){
    return this.authService.createUser(createUserByAdminDto);
  }

  @Post('register')
  createBlogger( @Body() createBloggerDto : CreateBloggerDto){
    return this.authService.createBlogger(createBloggerDto);
  }
}
