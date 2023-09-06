import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 3,
        jwksUri:
          configService.get('AWS_COGNITO_AUTHORITY') + '/.well-known/jwks.json',
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      _audience: configService.get('AWS_COGNITO_CLIENT_ID'),
      issuer: configService.get('AWS_COGNITO_AUTHORITY'),
      algorithms: ['RS256'],
      passReqToCallback: true,
    });
  }

  async validate(req: Request, user: any) {
    const isValidUser = user.sub === req.headers['userid'];
    if (!isValidUser) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
