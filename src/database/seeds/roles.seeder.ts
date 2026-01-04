import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { RolesService } from 'src/roles/roles.service';
import { DEFAULT_ROLES, PROJECT_ROLES } from 'src/roles/roles.config';

@Injectable()
export class RolesSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(RolesSeeder.name);

  constructor(private readonly rolesService: RolesService) {}


  //CREATE APPLICATION ROLES
  async onApplicationBootstrap() {
    
    const rolesToCreate = [...DEFAULT_ROLES, ...PROJECT_ROLES];

    for (const name of rolesToCreate) {
      const existing = await this.rolesService.findByName(name);
      if (!existing) {
        await this.rolesService.createRole(name);
        this.logger.log(`Role "${name}" CREATED ON DATABASE`);
      }
    }
  }
}
