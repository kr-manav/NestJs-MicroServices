import { Controller, Post, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller('productsHandler/')
export class ProductAPIController {
  constructor(private readonly appService: AppService) {}

  @Post('/checkQuantity/:pid/:quantity')
  async checkQuantity(
    @Param('pid') pid: number,
    @Param('quantity') quantity: number,
    @Res() res: Response,
  ): Promise<boolean> {
    res.status(200).json({
      message: await this.appService.checkQuantity(pid, quantity),
    });
    return true;
  }

  @Post('/getPrice/:pid/')
  async getPrice(
    @Param('pid') pid: number,
    @Res() res: Response,
  ): Promise<number> {
    const price = await this.appService.getPrice(pid);
    res.status(200).json({
      message: price,
    });
    return price;
  }

  @Post('/decreaseQuantity/:pid/:quantity')
  async decreaseQuantity(
    @Param('pid') pid: number,
    @Param('quantity') quantity: number,
    @Res() res: Response,
  ) {
    const product = await this.appService.decreaseQuantity(pid, quantity);
    if (product) {
      res.status(200).json({
        message: true,
      });
    }
  }
}
