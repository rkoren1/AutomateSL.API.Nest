import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Result } from 'src/core/constants/constants';
import { BotDb } from '../bot/entities/bot.entity';
import { AddTerminalBodyDto } from './dto/add-terminal-body.dto';
import { GetAllBotsQueryDto } from './dto/get-all-bots-query.dto';
import { GetAllBotsResponseDto } from './dto/get-all-bots-response.dto';
import { PaySubscriptionDto } from './dto/pay-subscription.dto';
import { RegisterBodyDto } from './dto/register-body.dto';
import { SharedActionsResponseDto } from './dto/shared-actions-response.dto';
import { TerminalOwner } from './entities/terminal-owner.entity';
import { TerminalService } from './terminal.service';

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
}
