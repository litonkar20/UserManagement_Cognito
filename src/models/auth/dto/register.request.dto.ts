import { IsString } from 'class-validator';

export class RegisterRequestDto {
  @IsString()
  phone_number: string;
}

export class ConfirmRegistrationDto {
  @IsString()
  phone_number: string;

  @IsString()
  otp: string;
}
