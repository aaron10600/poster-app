import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//GUARD TO ONLY ACCEPT REQUEST WITH JWT
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
