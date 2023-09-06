import { Controller, Get, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from './common/guards/jwt.guard';

@Controller('')
export class AppController {
  @Get('')
  @UseGuards(JwtAuthenticationGuard)
  helloWorld() {
    return 'Hi';
  }
}
