import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SharedBot } from '../shared-bot/entities/shared-bot.entity';
import { BotService } from './bot.service';
import { CreateBotResponseDto } from './dto/create-bot-response.dto';
import { CreateBotDto } from './dto/create-bot.dto';
import { GetBotConfigurationQueryDto } from './dto/get-bot-configuration-query.dto';
import { GetBotConfigurationResponseDto } from './dto/get-bot-configuration-response.dto';
import { GetBotDto } from './dto/get-bot.dto';
import { GetSharedBotsResponseDto } from './dto/get-shared-bots-response.dto';
import { StartBotQueryDto } from './dto/start-bot-query.dto';

@ApiTags('Bot')
@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post('createbot')
  @ApiOkResponse({
    type: CreateBotResponseDto,
  })
  create(@Body() createBotDto: CreateBotDto, @Req() req, @Res() res) {
    let firstName = req.body.slUserName;
    let lastName = 'Resident';
    if (firstName.includes('.')) {
      const splittedWords = firstName.split('.');
      lastName = splittedWords[1];
      firstName = splittedWords[0];
    } else if (firstName.includes(' ')) {
      firstName.split(' ');
      const splittedWords = firstName.split(' ');
      lastName = splittedWords[1];
      firstName = splittedWords[0];
    }
    const data = {
      userId: req['id'],
      loginFirstName: firstName,
      loginLastName: lastName,
      loginPassword: req.body.loginPassword,
      loginSpawnLocation: req.body.loginSpawnLocation,
      loginRegion: req.body.loginRegion,
    };
    return this.botService
      .create(data)
      .then((result) => {
        return res.json({ success: true });
      })
      .catch((error) => {
        if (error.exists === false) {
          return res.status(400).json({
            success: false,
            message: "SL Account Doesn't Exist!",
          });
        }
        return res
          .status(400)
          .json({ success: false, message: 'Adding new bot failed' });
      });
  }

  @Get('getbots')
  @ApiOkResponse({
    type: GetBotDto,
  })
  getAllBots(@Req() req) {
    const userId = req.id;
    return this.botService.getAllBots(userId).then((res) => res);
  }
  @Get('getbotconfiguration')
  @ApiOkResponse({
    type: GetBotConfigurationResponseDto,
  })
  getBotConfiguration(
    @Req() req,
    @Res() res,
    @Query()
    queryParams: GetBotConfigurationQueryDto,
  ) {
    const data = {
      botFirstName: queryParams.firstName,
      botLastName: queryParams.lastName,
      userId: req.id,
    };
    this.botService
      .getBotConfiguration(data)
      .then((result: any) => {
        if (!result)
          return res.status(404).json({
            id: null,
            loginFirstName: null,
            loginSpawnLocation: null,
            imageId: null,
            message: "Bot doesn't exist",
          });
        let response: GetBotConfigurationResponseDto;
        //dont send back "Resident" in name
        if (
          result.loginLastName === 'Resident' ||
          result.loginLastName === null
        ) {
          response = result;
        } else {
          response = result;
          response.loginFirstName =
            result.loginFirstName + '.' + result.loginLastName;
        }
        return res.json(response);
      })
      .catch((err) => res.sendStatus(500));
  }
  @Put('startbot')
  @ApiOkResponse({
    type: CreateBotResponseDto,
  })
  startBot(@Query() query: StartBotQueryDto, @Req() req, @Res() res) {
    const data = {
      botId: req.query.botId,
      userId: req['id'],
    };
    return this.botService
      .startBot(data)
      .then((result: { changedRows: number } | any) => {
        if (result.changedRows === 0)
          return res.status(400).json({
            success: false,
            message: 'SL Account info is missing',
          });
        return res.json({ success: true });
      })
      .catch((err) => {
        return res.json({ success: false });
      });
  }
  @Put('stopbot')
  @ApiOkResponse({
    type: CreateBotResponseDto,
  })
  stopBot(@Query() query: StartBotQueryDto, @Req() req, @Res() res) {
    const data = {
      botId: req.query.botId,
      userId: req['id'],
    };
    return this.botService
      .stopBot(data.botId, data.userId)
      .then((result) => res.json({ success: true }))
      .catch((err) => res.json({ success: false }));
  }
  @Get('getsharedbots')
  @ApiOkResponse({
    type: GetSharedBotsResponseDto,
  })
  getSharedBots(@Req() req, @Res() res) {
    const data = {
      userId: req['id'],
    };
    return this.botService
      .getSharedBots(data.userId)
      .then((result: SharedBot[]) => {
        const response = new Array<GetSharedBotsResponseDto>();
        result.forEach((ele) => {
          response.push({
            id: ele.id,
            loginName: ele.loginFirstName,
            loginLastName: ele.loginLastName,
            running: ele.running,
            uuid: ele.uuid,
            imageId: ele.imageId,
          });
        });
        return res.json(response);
      })
      .catch((err) => res.sendStatus(500));
  }
}
