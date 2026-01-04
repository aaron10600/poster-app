// import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

// @Injectable()
// export class ActiveGuard implements CanActivate {
//   canActivate(context: ExecutionContext): boolean {
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;

//     if (!user) {
//       throw new ForbiddenException('NO USER FOUND IN REQUEST');
//     }

//     if (user.isActive === false) {
//       throw new ForbiddenException('THIS USER ACCOUNT IS DEACTIVATED');
//     }

//     return true;
//   }
// }
