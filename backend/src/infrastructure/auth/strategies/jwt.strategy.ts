import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { UserEntityType } from 'src/domain/entities/user';
import { JwtPayload } from '../types/jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request & { cookies?: { access_token?: string } }) => {
          const token = req?.cookies?.access_token;
          return token || null;
        },
      ]),
      secretOrKey: config.getOrThrow('JWT_ACCESS_SECRET'),
    });
  }

  validate(
    payload: JwtPayload,
  ): Promise<Pick<UserEntityType, 'id' | 'username' | 'role'>> {
    if (!payload?.sub || !payload?.username || !payload?.role) {
      throw new UnauthorizedException('Invalid JWT token');
    }

    return Promise.resolve({
      id: payload.sub,
      username: payload.username,
      role: payload.role,
    });
  }
}
