import { IsString } from 'class-validator';

export class AuthenticateRequestDto {
  @IsString()
  phone_number: string;

  @IsString()
  mpin: string;
}

export class ConfirmPasswordDto {
  @IsString()
  phone_number: string;

  @IsString()
  mpin: string;

  @IsString()
  otp: string;
}
