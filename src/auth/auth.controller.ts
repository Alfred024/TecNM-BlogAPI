import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserAdminDto } from './dto/create-user-admin-dto';
import { CreateUserByAdminDto } from './dto/create-user-by-admin-dto';
import { CreateBloggerDto } from 'src/blogger/dto/create-blogger.dto';
import { LoginUserDto } from './dto/login-user-dto';
// Crear archivo de barril para GUARDS
import { JWTGuard } from './guards/jwt.guard';
import { CheckApiKeyGuard } from './guards/check-api-key.guard';
import { RefreshJWTGuard } from './guards/refresh-jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('refresh-token')
  @UseGuards(RefreshJWTGuard)
  refreshTokens() {
    // const userId = req.user['sub'];
    // const refreshToken = req.user['refreshToken'];
    return this.authService.getNewTokens();
    //return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('login')
  login(@Body() loginUserDto : LoginUserDto ){
    return this.authService.loginUser(loginUserDto);
  }

  @Post('register-admin')
  @UseGuards(CheckApiKeyGuard)
  createAdminUser( @Body() createUserAdminDto : CreateUserAdminDto ){
    //return 'Creando usuario';
    return this.authService.createAdminUser(createUserAdminDto);
  }

  @Post('register-by-admin')
  @UseGuards(CheckApiKeyGuard)
  createUser( @Body() createUserByAdminDto : CreateUserByAdminDto ){
    return this.authService.createUser(createUserByAdminDto);
  }

  // Proteger ruta con JWT del front
  @Post('register')
  @UseGuards(JWTGuard)
  createBlogger( @Body() createBloggerDto : CreateBloggerDto){
    return this.authService.createBlogger(createBloggerDto);
  }
}
   