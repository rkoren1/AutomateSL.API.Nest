import { Body, Controller, Get, Post, Put, Query, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Result } from 'src/core/constants/constants';
import { BotDb } from '../bot/entities/bot.entity';
import { User } from '../user/entities/user.entity';
import { AddTerminalBodyDto } from './dto/add-terminal-body.dto';
import { GetAllBotsQueryDto } from './dto/get-all-bots-query.dto';
import { GetAllBotsResponseDto } from './dto/get-all-bots-response.dto';
import { isRegisteredQueryDto } from './dto/is-registered-query.dto';
import { PaySubscriptionDto } from './dto/pay-subscription.dto';
import { RegisterBodyDto } from './dto/register-body.dto';
import { SetUserPasswordBodyDto } from './dto/set-user-password-body.dto';
import { SetUserPasswordQueryDto } from './dto/set-user-password-query.dto';
import { SharedActionsResponseDto } from './dto/shared-actions-response.dto';
import { UpdateTerminalActivityQueryDto } from './dto/update-terminal-activity-query.dto';
import { UpdateTerminalOwnerBodyDto } from './dto/update-terminal-owner-body.dto';
import { TerminalOwner } from './entities/terminal-owner.entity';
import { TerminalService } from './terminal.service';
import { AddBalanceBodyDto } from './dto/add-balance-body.dto';

@ApiTags('Terminal')
@Controller('terminal')
export class TerminalController {
  constructor(private readonly terminalService: TerminalService) {}
  @Get('getallbots')
  @ApiOkResponse({ type: [GetAllBotsResponseDto] })
  getAllBots(@Query() query: GetAllBotsQueryDto, @Res() res) {
    const data = {
      uuid: query.uuid,
      apikey: query.apiKey,
    };
    return this.terminalService
      .getAllBotsFromUserUuid(data.uuid)
      .then((result: BotDb[]) => {
        const response = new Array<GetAllBotsResponseDto>();
        result.forEach((ele) => {
          response.push({
            id: ele.id,
            loginName: ele.loginFirstName,
            running: ele.running,
            imageId: ele.imageId,
            packageId: ele.packageId,
          });
        });
        return res.json(response);
      })
      .catch((err) => res.sendStatus(500));
  }
  @Post('paysubscription')
  @ApiOkResponse({ type: SharedActionsResponseDto })
  paySubscription(@Res() res, @Body() body: PaySubscriptionDto) {
    const data: PaySubscriptionDto = {
      extensionTime: body.extensionTime,
      extensionTimeUnit: body.extensionTimeUnit,
      packageId: body.packageId,
      botId: body.botId,
    };
    this.terminalService
      .paySubscription(data)
      .then((result) =>
        res.json({
          result: Result.OK,
          resulttext: 'endDate',
          custom: { endDate: result },
        }),
      )
      .catch((err) =>
        res.json({
          result: Result.FAIL,
          resulttext: 'Payment Failed',
          custom: '',
        }),
      );
  }
  @Post('register')
  @ApiOkResponse({ type: SharedActionsResponseDto })
  terminalRegister(@Res() res, @Body() body: RegisterBodyDto) {
    const data = {
      uuid: body.uuid,
      email: body.email,
      avatarName: body.avatarName,
      password: this.terminalService.generatePassword(8),
    };
    return this.terminalService
      .terminalRegister(data)
      .then((password: string) =>
        res.json({
          result: Result.OK,
          resulttext: 'newClient',
          custom: { password: password, uuid: data.uuid },
        }),
      )
      .catch((err) => {
        if (err.errno === 1062)
          return res.json({
            result: Result.FAIL,
            resulttext: 'existingClient',
            custom: { password: '', uuid: data.uuid },
          });
        return res.json({
          result: Result.FAIL,
          resulttext: 'Registration Failed',
          custom: { password: '', uuid: data.uuid },
        });
      });
  }
  @Post('addterminal')
  @ApiOkResponse({ type: SharedActionsResponseDto })
  addTerminal(@Res() res, @Body() body: AddTerminalBodyDto) {
    const data = {
      avatarName: body.avatarName,
      avatarUUID: body.avatarUUID,
      parcelName: body.parcelName,
      slUrl: body.slUrl,
      lastActive: new Date(),
    };
    return this.terminalService
      .addTerminal(data)
      .then((result: TerminalOwner) =>
        res.json({
          result: Result.OK,
          resulttext: 'registered',
          custom: { terminalId: result.id },
        }),
      )
      .catch((err) =>
        res.json({
          result: Result.FAIL,
          resulttext: 'Adding terminal failed',
          custom: {},
        }),
      );
  }
  @Get('isregistered')
  @ApiOkResponse({ type: SharedActionsResponseDto })
  isRegistered(@Query() query: isRegisteredQueryDto, @Res() res) {
    const data = {
      uuid: query.uuid,
    };
    return this.terminalService
      .isRegistered(data.uuid)
      .then((result: User) => {
        if (result) {
          return res.json({
            result: Result.OK,
            resulttext: 'registered_user',
            custom: { id: result?.id, uuid: data.uuid },
          });
        }
        return res.json({
          result: Result.OK,
          resulttext: 'unregistered_user',
          custom: { uuid: data.uuid },
        });
      })
      .catch((err) =>
        res.json({
          result: Result.FAIL,
          resulttext: 'FAIL',
          custom: {},
        }),
      );
  }
  @Post('updateterminalactivity')
  @ApiOkResponse({ type: SharedActionsResponseDto })
  updateTerminalActivity(
    @Res() res,
    @Query() query: UpdateTerminalActivityQueryDto,
  ) {
    const data = {
      lastActive: new Date(),
      terminalId: query.terminalId,
    };
    return this.terminalService
      .updateTerminalActivity(data)
      .then((result) =>
        res.json({
          result: Result.OK,
          resulttext: 'Last activity prolonged',
          custom: {},
        }),
      )
      .catch((err) =>
        res.json({
          result: Result.FAIL,
          resulttext: 'FAIL',
          custom: {},
        }),
      );
  }
  @Put('updateterminalowner')
  @ApiOkResponse({ type: SharedActionsResponseDto })
  updateTerminalOwner(@Res() res, @Body() body: UpdateTerminalOwnerBodyDto) {
    const data: UpdateTerminalOwnerBodyDto = {
      terminalId: body.terminalId,
      avatarName: body.avatarName,
      avatarUUID: body.avatarUUID,
      parcelName: body.parcelName,
      slUrl: body.slUrl,
    };

    return this.terminalService
      .updateTerminalOwner(data)
      .then((result) =>
        res.json({
          result: Result.OK,
          resulttext: 'Terminal updated successfully',
          custom: {},
        }),
      )
      .catch((err) =>
        res.json({
          result: Result.FAIL,
          resulttext: 'Error occured',
          custom: {},
        }),
      );
  }
  @Put('setuserpassword')
  @ApiOkResponse({ type: SharedActionsResponseDto })
  setUserPassword(
    @Res() res,
    @Body() body: SetUserPasswordBodyDto,
    @Query() query: SetUserPasswordQueryDto,
  ) {
    const data = {
      userUUID: query.userUUID,
      password: body.password,
    };
    return this.terminalService
      .setUserPassword(data.userUUID, data.password)
      .then((user: User) =>
        res.json({
          result: Result.OK,
          resulttext: 'password_updated',
          custom: {
            id: data.userUUID,
            password: data.password,
            email: user.email,
          },
        }),
      )
      .catch((err) => {
        res.json({
          result: Result.FAIL,
          resulttext: 'password_update_fail',
          custom: { id: data.userUUID },
        });
      });
  }
  @Put('addbalance')
  @ApiOkResponse({ type: SharedActionsResponseDto })
  addBalance(@Res() res, @Body() body: AddBalanceBodyDto) {
    this.terminalService
      .addBalance(body)
      .then((newBalance: number) =>
        res.json({
          result: Result.OK,
          resulttext: 'payment_success',
          custom: { UUID: body.UUID, newBalance: newBalance },
        }),
      )
      .catch((err) =>
        res.json({
          result: Result.FAIL,
          resulttext: 'payment_fail',
          custom: { UUID: body.UUID },
        }),
      );
  }
}
