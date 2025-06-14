import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { UserEntityType } from 'src/domain/entities/user';
import { JwtPayload } from '../types/jwt-payload';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request & { cookies: { refresh_token?: string } }) => {
          const token = req.cookies.refresh_token;
          return token || null;
        },
      ]),
      secretOrKey: config.getOrThrow('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    _req: Request,
    payload: JwtPayload,
  ): Promise<Pick<UserEntityType, 'id' | 'username' | 'role'>> {
    if (!payload?.sub || !payload?.username) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Проверяем, что пользователь все еще существует
    const user = await this.authService.validateUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
