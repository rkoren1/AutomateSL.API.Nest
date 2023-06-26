import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetLDollarBalanceReponseDto } from './dto/get-ldollar-balance-response.dto';
import { PayForPackageResponseDto } from './dto/pay-for-package-response.dto';
import { PayForPackageDto } from './dto/pay-for-package.dto';
import { PaymentService } from './payment.service';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('getldollarbalance')
  @ApiOkResponse({
    type: GetLDollarBalanceReponseDto,
  })
  getLDollarBalance(@Req() req) {
    return this.paymentService.getLDollarBalance(req.id);
  }

  @Post('payforpackage')
  @ApiOkResponse({
    type: PayForPackageResponseDto,
  })
  payForPackage(
    @Req() req,
    @Body() payForPackageDto: PayForPackageDto,
    @Res() res,
  ) {
    const data = {
      userId: req.id,
      packageId: payForPackageDto.packageId,
      dateUnit: payForPackageDto.dateUnit,
      amountOfDateUnits: payForPackageDto.amountOfDateUnits,
      botId: payForPackageDto.botId,
    };
    if (data.amountOfDateUnits < 1) {
      return res.json({
        success: false,
        message: 'Number of weeks/months is invalid!',
      });
    }
    return this.paymentService
      .payForPackage(data)
      .then((result) => res.json(result))
      .catch((err) => {
        res.json(err);
      });
  }
}
