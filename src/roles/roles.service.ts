import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  findByName(name: string) {
    return this.roleRepository.findOne({ where: { name } });
  }

  //CREATE A ROLE => USED ON THE INITIAL SEED
  async createRole(name: string) {
    const existing = await this.findByName(name);
    if (existing) return existing; 
    const role = this.roleRepository.create({ name });
    return this.roleRepository.save(role);
  }
}
