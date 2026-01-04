import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';


//GUARD TO CHECK IF THE USER IS VERIFIED
@Injectable()
export class VerifiedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.isVerified) {
      throw new ForbiddenException(`User with email ${user.email} is not verified`);
    }

    return true;
  }
}
