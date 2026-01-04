import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailVerification } from './entities/email-verification.entity';
import { User } from '../users/entities/user.entity';

import * as bcrypt from 'bcryptjs';


@Injectable()
export class EmailVerificationService {
    constructor(
        @InjectRepository(EmailVerification)
        private readonly repo: Repository<EmailVerification>
    ){}

    async createCode(user: User) {
        const { v4: uuidv4 } = await import('uuid');
        const code = uuidv4();
        const hashed = await bcrypt.hash(code,12);

        const record = this.repo.create({
            user,
            codeHash: hashed,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60),
            //USED IS ALREADY DEFINED AS FALSE ON THE ENTITY
        });

        await this.repo.save(record);
        return code;
    }


    async verifyCode(user: User, code: string) {
        const record = await this.repo.findOne({
            where: {
            user: { id: user.id },
            used: false,
            },
            order: { createdAt: 'DESC' },
            relations: ['user'],
        });

        if (!record) {
            console.log('NO VERIFICATION CODE ON DB');
            return false;
        }

        if (record.expiresAt < new Date()) console.log("VERIFICATION CODE EXPIRED, TRY AGAIN")

        if (record.expiresAt < new Date()) return false;

        const match = await bcrypt.compare(code, record.codeHash);
        if (!match) return false;

        record.used = true;
        await this.repo.save(record);
        return true;
    }

}