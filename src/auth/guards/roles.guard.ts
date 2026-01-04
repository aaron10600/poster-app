import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

//GUARD TO CHECK IF THE USER THAT REQUESTED WITH A JWT HAS THE PROPER ROLE(S)
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    const hasRole = user?.roles?.some((role: string) =>
      requiredRoles.includes(role),
    );

    if (!hasRole) {
      throw new ForbiddenException('THIS USER DOES NOT HAVE THE REQUIRED ROLE(S)');
    }

    return true;
  }
}
