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

  @Post('verify-otp')
  async verifyOTP(@Body() confirmRegistrationDto: ConfirmRegistrationDto) {
    try {
      return await this.authService.verifyOTP(confirmRegistrationDto);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('resend-otp')
  async resendOTP(@Body() registerRequest: RegisterRequestDto) {
    try {
      return await this.authService.resendOTP(registerRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('set-mpin')
  async setMpin(@Body() authenticateRequest: AuthenticateRequestDto) {
    try {
      return await this.authService.setMpin(authenticateRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('login')
  async login(@Body() authenticateRequest: AuthenticateRequestDto) {
    try {
      return await this.authService.login(authenticateRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('reset/mpin-otp')
  async sendResetMpinOTP(@Body() registerRequest: RegisterRequestDto) {
    try {
      return await this.authService.sendResetMpinOTP(registerRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('reset/mpin')
  async resetMpin(@Body() registerRequest: ConfirmPasswordDto) {
    try {
      return await this.authService.resetMpin(registerRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
