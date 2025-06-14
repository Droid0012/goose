import {
  Controller,
  Post,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';

import { CreateBattleUseCase } from './create-battle/create-battle.use-case';
import { GetCurrentBattlesUseCase } from './get-current-battles/get-current-battles.use-case';
import { ApplicationError } from 'src/shared/application-error';
import { BattleEntityType } from 'src/domain/entities/battle';
import { RolesGuard } from 'src/infrastructure/authorization/roles.guard';
import { Roles } from 'src/infrastructure/authorization/roles.decorator';

interface BattleResponse<T = any> {
  success: boolean;
  statusCode: number;
  data?: T;
  error?: string;
  applicationError?: string;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/battles')
export class BattleController {
  constructor(
    private readonly createBattleUseCase: CreateBattleUseCase,
    private readonly getCurrentBattlesUseCase: GetCurrentBattlesUseCase,
  ) {}

  @Roles('ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBattle(): Promise<BattleResponse<BattleEntityType>> {
    const result = await this.createBattleUseCase.execute();

    if (result instanceof ApplicationError) {
      const statusCode = (() => {
        switch (result.type) {
          default:
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }
      })();

      return {
        success: false,
        statusCode,
        error: result.message,
      };
    }

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      data: result,
    };
  }

  @Roles('ADMIN')
  @Get('current')
  @HttpCode(HttpStatus.OK)
  async getCurrentBattles(): Promise<
    BattleResponse<{ battles: BattleEntityType[] }>
  > {
    const result = await this.getCurrentBattlesUseCase.execute();

    if (result instanceof ApplicationError) {
      const statusCode = (() => {
        switch (result.type) {
          default:
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }
      })();

      return {
        success: false,
        statusCode,
        error: result.message,
      };
    }

    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: { battles: result.result },
    };
  }
}
