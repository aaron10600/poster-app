import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { VerifiedGuard } from 'src/auth/guards/verified.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';



//TEST PROTECTED ENDPOINTS WITH DIFFERENT RESTRICTIONS
@Controller('test')
export class TestController{

    //ONLY JWT REQUIRED
    @UseGuards(JwtAuthGuard)
    @Get('jwt-check')
    jwtOnly() {
        return { 
            message: 'ACCESS GRANTED TO THIS ENDPOINT CAUSE YOU HAVE A JWT'
        }
    }

    //JWT AND VERIFIED USER REQUIRED
    @UseGuards(JwtAuthGuard, VerifiedGuard)
    @Get('verified-check')
    verifiedOnly() {
        return { 
            message: 'ACCES GRANTED TO THIS ENDPOINT CAUSE YOU HAVE A JWT OF A VERIFIED USER'
        }
    }

    //JWT, VERIFIED AND SUPERADMIN ROLE NEEDED
    @UseGuards(JwtAuthGuard, VerifiedGuard, RolesGuard)
    @Roles('SUPERADMIN')
    @Get('superadmin-check')
    superAdminOnly() {
        return { 
            message: 'ACCES GRANTED TO THIS ENDPOINT CAUSE YOU HAVE A JWT OF A VERIFIED USER WITH SUPERADMIN ROLE'
        }
    }

    //TEST FOR CUSTOM ROLES REQUIRED
    @UseGuards(JwtAuthGuard, VerifiedGuard, RolesGuard)
    @Roles('ONE_OF_YOUR_CUSTOM_ROLES')
    @Get('custom-role-check')
    customRoleCheck(){
        return {
            message: 'ACCES GRANTED TO THIS ENDPOINT CAUSE YOU HAVE A JWT OF A VERIFIED USER WITH THE CUSTOM ROLE YOU WANT'
        }
    }

    @Get('ip')
    getIp(@Req() req) {
    return req.ip;
    }

    @Get('rate-limiting-test')
    testRateLimit(@Req() req) {
        return {
            ok: true
        }
    }


}