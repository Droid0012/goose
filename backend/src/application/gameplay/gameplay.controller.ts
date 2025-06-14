import {
  Controller,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Put,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserType,
} from 'src/infrastructure/auth/decorators/current-user.decorator';
import {
  TapGooseUseCase,
  ApplyTapCommand,
} from './tap-goose/tap-goose.use-case';
import {
  GetBattleStateUseCase,
  GetBattleStateResult,
} from './get-battle-state/get-battle-state.use-case';
import { ApplicationError } from 'src/shared/application-error';
import { UserRole } from 'src/infrastructure/auth/types/jwt-payload';
import { RolesGuard } from 'src/infrastructure/authorization/roles.guard';
import { Roles } from 'src/infrastructure/authorization/roles.decorator';

interface TapResponse {
  success: boolean;
  statusCode: number;
  error?: string;
  applicationError?: string;
  scoreAdded?: number;
}

interface BattleStateResponse {
  success: boolean;
  statusCode: number;
  data?: GetBattleStateResult;
  error?: string;
  applicationError?: string;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/gameplay')
export class GameplayController {
  constructor(
    private readonly tapGooseUseCase: TapGooseUseCase,
    private readonly getBattleStateUseCase: GetBattleStateUseCase,
  ) {}

  @Roles('PLAYER')
  @HttpCode(200)
  @Put()
  async tap(
    @CurrentUser() user: CurrentUserType & { role: UserRole },
    @Body() body: { battleId: string },
  ): Promise<TapResponse> {
    if (!body.battleId) {
      return {
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Battle ID is required',
        applicationError: 'ValidationError',
      };
    }

    const command: ApplyTapCommand = {
      battleId: body.battleId,
      user: user,
    };

    const result = await this.tapGooseUseCase.execute(command);

    if (result instanceof ApplicationError) {
      switch (result.type) {
        case 'BattleNotFound':
          throw new NotFoundException(result.message);
        case 'BattleInactive':
          throw new ConflictException(result.message);
        default:
          throw new InternalServerErrorException(result.message);
      }
    }

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Roles('PLAYER')
  @Get('battles/:battleId/state')
  @HttpCode(HttpStatus.OK)
  async getBattleState(
    @Param('battleId') battleId: string,
    @CurrentUser() user: CurrentUserType & { role: UserRole },
  ): Promise<BattleStateResponse> {
    const result = await this.getBattleStateUseCase.execute({
      battleId,
      user,
    });

    if (result instanceof ApplicationError) {
      switch (result.type) {
        case 'BattleNotFound':
          throw NotFoundException;
        default:
          throw InternalServerErrorException;
      }
    }

    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: result,
    };
  }
}
