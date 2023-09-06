import { Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { ConfigService } from '@nestjs/config';
import {
  ConfirmRegistrationDto,
  RegisterRequestDto,
} from '../dto/register.request.dto';
import {
  AuthenticateRequestDto,
  ConfirmPasswordDto,
} from '../dto/authenticate.request.dto';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;

  constructor(private configService: ConfigService) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.configService.get<string>('AWS_COGNITO_USER_POOL_ID'),
      ClientId: this.configService.get<string>('AWS_COGNITO_CLIENT_ID'),
    });
  }

  async register(registerRequest: RegisterRequestDto) {
    return new Promise((resolve, reject) => {
      const { phone_number } = registerRequest;
      return this.userPool.signUp(
        phone_number,
        phone_number,
        [new CognitoUserAttribute({ Name: 'email', Value: phone_number })],
        null,
        (err, result) => {
          if (!result) {
            reject(err);
          } else {
            resolve(result);
          }
        },
      );
    });
  }

  async verifyOTP(confirmRegistrationDto: ConfirmRegistrationDto) {
    const { phone_number, otp } = confirmRegistrationDto;
    const userData = {
      Username: phone_number,
      Pool: this.userPool,
    };
    const userCognito = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return userCognito.confirmRegistration(otp, true, (err, result) => {
        if (!result) {
          reject(err);
        } else {
          const authenticationDetails = new AuthenticationDetails({
            Username: phone_number,
            Password: phone_number,
          });
          userCognito.authenticateUser(authenticationDetails, {
            onSuccess: () => {
              resolve('SUCCESS');
            },
            onFailure: (err) => {
              reject(err);
            },
          });
        }
      });
    });
  }

  async resendOTP(registerRequest: RegisterRequestDto) {
    const { phone_number } = registerRequest;
    const userData = {
      Username: phone_number,
      Pool: this.userPool,
    };
    const userCognito = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return userCognito.resendConfirmationCode(function (err, result) {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }

  async setMpin(authenticateRequestDto: AuthenticateRequestDto) {
    const { phone_number, mpin } = authenticateRequestDto;
    const authenticationDetails = new AuthenticationDetails({
      Username: phone_number,
      Password: phone_number,
    });
    const userData = {
      Username: phone_number,
      Pool: this.userPool,
    };
    const userCognito = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return userCognito.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          userCognito.changePassword(phone_number, mpin, (err, res) => {
            if (err) {
              reject(err);
              return;
            } else {
              resolve({
                userId: result.getAccessToken().payload.sub,
                accessToken: result.getAccessToken().getJwtToken(),
                refreshToken: result.getRefreshToken().getToken(),
              });
            }
          });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  async login(authenticateRequestDto: AuthenticateRequestDto) {
    const { phone_number, mpin } = authenticateRequestDto;
    const authenticationDetails = new AuthenticationDetails({
      Username: phone_number,
      Password: mpin,
    });
    const userData = {
      Username: phone_number,
      Pool: this.userPool,
    };
    const userCognito = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return userCognito.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve({
            userId: result.getAccessToken().payload.sub,
            accessToken: result.getAccessToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
          });
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  async sendResetMpinOTP(registerRequestDto: RegisterRequestDto) {
    const { phone_number } = registerRequestDto;
    const userData = {
      Username: phone_number,
      Pool: this.userPool,
    };
    const userCognito = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return userCognito.forgotPassword({
        onSuccess: function (result) {
          resolve(result);
        },
        onFailure: function (err) {
          reject(err);
        },
      });
    });
  }

  async resetMpin(confirmPasswordDto: ConfirmPasswordDto) {
    const { phone_number, otp, mpin } = confirmPasswordDto;
    const userData = {
      Username: phone_number,
      Pool: this.userPool,
    };
    const userCognito = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return userCognito.confirmPassword(otp, mpin, {
        onSuccess: function (result) {
          resolve(result);
        },
        onFailure: function (err) {
          reject(err);
        },
      });
    });
  }
}
