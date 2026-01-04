import { SetMetadata } from '@nestjs/common';

//GETS THE ROLES THAT YOU WANT THE ENDPOINT TO ACCEPT
export const Roles = (...roles: string[]) =>
  SetMetadata('roles', roles);
