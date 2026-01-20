import { Controller, Get } from '@nestjs/common';

@Controller('deploy-test')
export class DeployController {
  @Get()
  test() {
    return 'Cambio desplegado automáticamente';
  }
}
