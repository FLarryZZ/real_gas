import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
    private static getjwtfromcookie(request: Request){
        try {
            return request.cookies.jwt
        } catch (error) {
            throw new UnauthorizedException('JWT is missing')
        }
    }

  constructor(
      private readonly configservice:ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.getjwtfromcookie]),
      ignoreExpiration: true,
      secretOrKey: configservice.get('JWT')
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub };
  }
}