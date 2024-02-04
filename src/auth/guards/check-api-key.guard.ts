import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Observable } from "rxjs";

@Injectable()
export class CheckApiKeyGuard implements CanActivate{
    constructor(

        private readonly configService : ConfigService,
    ){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        let request = context.switchToHttp().getRequest();
        const requestValidated = this.checkApiKey(request);
        return requestValidated;
    }

    private checkApiKey(request : Request) : boolean{
        try {
            const apiKey = request.headers['apikey'];
            if (apiKey === this.configService.get('api_key')){
                return true;
            }
            return false;    
        } catch (error) {
            console.log(error);
            throw new Error('Unauthorized route. Check console.');
        }
    }
}