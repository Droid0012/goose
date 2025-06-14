import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../database/user.repository';
import { UserEntityType } from 'src/domain/entities/user';
import * as bcrypt from 'bcrypt';
import { JwtPayload, UserRole } from './types/jwt-payload';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly userRepository: UserRepository,
  ) {}

  async validateOrRegister(
    username: UserEntityType['username'],
    password: UserEntityType['password'],
  ): Promise<{ id: string; username: string; role: UserRole }> {
    const existingUser = await this.userRepository.findByUsername(username);

    if (existingUser) {
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }
      return {
        id: existingUser.id,
        username: existingUser.username,
        role: existingUser.role,
      };
    }

    const role: UserRole = username.toLocaleLowerCase().includes('admin')
      ? 'ADMIN'
      : 'PLAYER';

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userRepository.create(
      username,
      hashedPassword,
      role,
    );

    return {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
    };
  }

  async validateUserById(
    id: UserEntityType['id'],
  ): Promise<Pick<UserEntityType, 'id' | 'username' | 'role'> | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      role: user.role,
      username: user.username,
    };
  }

  async generateTokens(
    user: Pick<UserEntityType, 'id' | 'username' | 'role'>,
  ): Promise<Tokens> {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyRefreshToken(
    token: string,
  ): Promise<{ sub: string; username: string }> {
    const payload = await this.jwt.verifyAsync<{
      sub: UserEntityType['id'];
      username: UserEntityType['username'];
    }>(token, {
      secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
    });
    return payload;
  }

  async refreshTokens(refreshToken: string): Promise<Tokens> {
    try {
      const payload = await this.jwt.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
      });

      const user = await this.userRepository.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens({
        id: user.id,
        username: user.username,
        role: user.role,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
