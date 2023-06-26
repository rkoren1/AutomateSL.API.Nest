import { Body, Controller, Get, Param, Res } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { GetLDollarBalanceReponseDto } from './dto/get-ldollar-balance-response.dto';
import { PayForPackageResponseDto } from './dto/pay-for-package-response.dto';
import { PayForPackageDto } from './dto/pay-for-package.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('getldollarbalance')
  @ApiOkResponse({
    type: GetLDollarBalanceReponseDto,
  })
  getLDollarBalance(@Param('id') userId: number) {
    return this.paymentService.getLDollarBalance(+userId);
  }

  @Get('payforpackage')
  @ApiOkResponse({
    type: PayForPackageResponseDto,
  })
  payForPackage(
    @Param('id') userId: string,
    @Body() payForPackageDto: PayForPackageDto,
    @Res() res,
  ) {
    const data = {
      userId: userId,
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
