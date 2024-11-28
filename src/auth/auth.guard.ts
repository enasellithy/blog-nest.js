import { forwardRef, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
  ) {
    super();
    console.log('AuthService injected in JwtAuthGuard:', this.authService); // Check if this is null or undefined
  }

  async canActivate(context: any): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    console.log('Token in JwtAuthGuard:', token);

    if (!this.authService) {
      console.log('AuthService is undefined in JwtAuthGuard');
      throw new Error('AuthService is not injected properly');
    }

    const block = await this.authService.isTokenBlacklisted(token);
    console.log('Is token blacklisted:', block);

    if (token && block) {
      throw new UnauthorizedException('Token has been blacklisted');
    }

    const result = await super.canActivate(context);
    if (result instanceof Observable) {
      return result.toPromise();
    }
    return result;
  }

  private extractToken(request: any): string | null {
    const authorizationHeader = request.headers['authorization'];
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      return authorizationHeader.substring(7);
    }
    return null;
  }
}
