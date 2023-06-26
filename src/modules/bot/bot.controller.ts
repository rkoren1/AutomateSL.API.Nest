import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BotService } from './bot.service';
import { CreateBotResponseDto } from './dto/create-bot-response.dto';
import { CreateBotDto } from './dto/create-bot.dto';
import { GetBotDto } from './dto/get-bot.dto';

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
}
