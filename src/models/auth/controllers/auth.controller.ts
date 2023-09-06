import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import {
  AuthenticateRequestDto,
  ConfirmPasswordDto,
} from '../dto/authenticate.request.dto';
import {
  ConfirmRegistrationDto,
  RegisterRequestDto,
} from '../dto/register.request.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerRequest: RegisterRequestDto) {
    try {
      return await this.authService.register(registerRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('authenticate')
  async authenticate(@Body() authenticateRequest: AuthenticateRequestDto) {
    try {
      return await this.authService.authenticate(authenticateRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('confirm')
  async confirmRegistration(
    @Body() confirmRegistrationDto: ConfirmRegistrationDto,
  ) {
    try {
      return await this.authService.confirmRegistration(confirmRegistrationDto);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('reset')
  async resetPassword(@Body() registerRequest: RegisterRequestDto) {
    try {
      return await this.authService.resetPassword(registerRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('setNewpassword')
  async setNewpassword(@Body() registerRequest: ConfirmPasswordDto) {
    try {
      return await this.authService.setNewpassword(registerRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('changePassword')
  async changePassword(@Body() authenticateRequest: AuthenticateRequestDto) {
    try {
      return await this.authService.changePassword(authenticateRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
