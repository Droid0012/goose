import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserType,
} from 'src/infrastructure/auth/decorators/current-user.decorator';
import { GetBattleResultsUseCase } from './get-battle-results.ts/get-battle-results.use-case';
import { ApplicationError } from 'src/shared/application-error';
import { RolesGuard } from 'src/infrastructure/authorization/roles.guard';
import { Roles } from 'src/infrastructure/authorization/roles.decorator';

interface StatsResponse<T = any> {
  success: boolean;
  statusCode: number;
  data?: T;
  error?: string;
  applicationError?: string;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/stats')
export class StatsController {
  constructor(
    private readonly getBattleResultsUseCase: GetBattleResultsUseCase,
  ) {}

  @Roles('PLAYER')
  @Get('battle/:battleId')
  @HttpCode(HttpStatus.OK)
  async getBattleResults(
    @Param('battleId') battleId: string,
    @CurrentUser() user: CurrentUserType,
  ): Promise<StatsResponse> {
    const result = await this.getBattleResultsUseCase.execute({
      battleId,
      user,
    });

    if (result instanceof ApplicationError) {
      const statusCode = (() => {
        switch (result.type) {
          case 'BattleNotFound':
            throw NotFoundException;
          case 'BattleNotReady':
            return HttpStatus.NO_CONTENT;
          default:
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }
      })();

      return {
        success: false,
        statusCode,
        error: result.message,
        applicationError: result.type,
      };
    }

    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: result,
    };
  }
}
