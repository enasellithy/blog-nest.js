import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Observable } from "rxjs"; // Make sure to import your AuthService

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private authService: AuthService) {
    super(); // Call the constructor of the base AuthGuard class
  }

  // Override canActivate to add blacklist check
  async canActivate(context: any): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    // Check if the token is blacklisted
    if (token && this.authService.isTokenBlacklisted(token)) {
      throw new UnauthorizedException('Token has been blacklisted');
    }

    // Proceed with the regular AuthGuard functionality, wait for the result
    const result = await super.canActivate(context);  // Await the result to resolve the promise or observable

    // If the result is an observable, wait for it to resolve
    if (result instanceof Observable) {
      return result.toPromise(); // Convert Observable to a Promise
    }

    return result; // Return the boolean result directly if it's already a boolean
  }

  // Extract token from the Authorization header
  private extractToken(request: any): string | null {
    const authorizationHeader = request.headers['authorization'];
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      return authorizationHeader.substring(7); // Remove the 'Bearer ' prefix
    }
    return null; // No token found
  }
}
