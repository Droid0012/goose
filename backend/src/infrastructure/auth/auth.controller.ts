import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Get,
  HttpCode,
  BadRequestException,
  UnauthorizedException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserType,
} from './decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { ApplicationError } from 'src/shared/application-error';
import { UserEntityType } from 'src/domain/entities/user';

interface LoginDto {
  username: UserEntityType['username'];
  password: UserEntityType['password'];
}

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(201)
  async login(@Body() body: LoginDto, @Res() res: Response) {
    if (!body.username || !body.password) {
      throw new BadRequestException('Username and password are required');
    }

    const result = await this.authService.validateOrRegister(
      body.username,
      body.password,
    );

    if (result instanceof ApplicationError) {
      switch (result.type) {
        case 'InvalidCredentials':
          throw new UnauthorizedException(result.message);
        default:
          throw new ServiceUnavailableException('An unexpected error occurred');
      }
    }

    const tokensResult = await this.authService.generateTokens(result);
    if (tokensResult instanceof ApplicationError) {
      throw new ServiceUnavailableException('An unexpected error occurred');
    }

    const { accessToken, refreshToken } = tokensResult;

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/v1/auth/refresh',
    });

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return res.json({
      user: {
        id: result.id,
        username: result.username,
        role: result.role,
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: CurrentUserType) {
    return { user };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(201)
  async refresh(@CurrentUser() user: CurrentUserType, @Res() res: Response) {
    const tokensResult = await this.authService.generateTokens(user);
    if (tokensResult instanceof ApplicationError) {
      throw new ServiceUnavailableException('An unexpected error occurred');
    }

    const { accessToken, refreshToken } = tokensResult;

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/v1/auth/refresh',
    });

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return res.json();
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Res() res: Response) {
    res.clearCookie('refresh_token');
    res.clearCookie('access_token');
    return res.send();
  }
}
