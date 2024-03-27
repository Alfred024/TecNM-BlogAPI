import { ConfigService } from "@nestjs/config";
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayloadDto } from "../dto/jwt-payload-dto";
import { AuthGuard } from "@nestjs/passport";

// Toma el usuario de la reuqest y 
// @Injectable()
// export class RefreshJWTGuard implements CanActivate {
//     constructor(
//         private jwtService: JwtService,
//         private readonly configService : ConfigService,
//     ){}
  
//     async canActivate(context: ExecutionContext): Promise<boolean> {
//       const request = context.switchToHttp().getRequest();
//       const token = this.extractTokenFromHeader(request);
//       if (!token) {
//         console.log('No hay token');
//         throw new UnauthorizedException();
//       }
//       try {
//         const payload : JwtPayloadDto = await this.jwtService.verifyAsync(
//           token,
//           {
//             secret: this.configService.get('refresh_jwt_secret')
//           }
//         );
        
//         request['user'] = payload;
//         return true;
//       } catch {
//         console.log('Error con el payload o algo');
//         throw new UnauthorizedException();
//       }
//     }
  
//     private extractTokenFromHeader(request: Request): string | undefined {
//       const [type, token] = request.headers.authorization?.split(' ') ?? [];
//       return type === 'Bearer' ? token : undefined;
//     }
// }

@Injectable()
export class RefreshJWTGuard extends AuthGuard('jwt-refresh') {}