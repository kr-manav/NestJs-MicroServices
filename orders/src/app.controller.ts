import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Order } from './app.schema';
import { AppService } from './app.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('orders')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService,
  ) {}

  @Get()
  async all(): Promise<Order[]> {
    return await this.appService.findAll();
  }

  @Post('/placeOrder')
  async create(
    @Req() req: Request,
    @Res() res: Response,
    @Body('pid') pid: string,
    @Body('quantity') quantity: number,
    @Body('deliveryDone') deliveryDone: number,
    @Body('orderCancelled') orderCancelled: boolean,
    @Body('deliveryDate') deliveryDate: string,
    @Body('deliveryAddress') deliveryAddress: string,
    @Body('receiverPhone') receiverPhone: string,
    @Body('paymentMethod') paymentMethod: string,
  ): Promise<Order> {
    const responseCheckQuantity = await firstValueFrom(
      this.httpService
        .post(
          `http://localhost:5001/api/productsHandler/checkQuantity/${pid}/${quantity}`,
        )
        .pipe(),
    );

    if (responseCheckQuantity.data.message) {
      const responsePrice = await firstValueFrom(
        this.httpService
          .post(`http://localhost:5001/api/productsHandler/getPrice/${pid}`)
          .pipe(),
      );
      const orderAmount = quantity * responsePrice.data.message;
      const responseDecreaseQuantity = await firstValueFrom(
        this.httpService
          .post(
            `http://localhost:5001/api/productsHandler/decreaseQuantity/${pid}/${quantity}`,
          )
          .pipe(),
      );

      if (responseDecreaseQuantity.data.message) {
        res.status(200).json({
          Order: await this.appService.create({
            cid: req['user'].id,
            pid,
            quantity,
            orderAmount,
            deliveryDone,
            orderCancelled,
            deliveryDate,
            deliveryAddress,
            receiverPhone,
            paymentMethod,
          }),
        });
      } else {
        res.status(400).json({
          message: 'Quantity Not Updated',
        });
      }
    } else {
      res.status(400).json({
        message: 'Not enough Quantity',
      });
      return;
    }
  }

  @Put('/editOrder/:id')
  async edit(
    @Param('id') id: number,
    @Body('cid') cid: string,
    @Body('pid') pid: string,
    @Body('quantity') quantity: number,
    @Body('orderAmount') orderAmount: number,
    @Body('deliveryDone') deliveryDone: number,
    @Body('orderCancelled') orderCancelled: boolean,
    @Body('deliveryDate') deliveryDate: string,
    @Body('deliveryAddress') deliveryAddress: string,
    @Body('receiverPhone') receiverPhone: string,
    @Body('paymentMethod') paymentMethod: string,
  ): Promise<Order> {
    return await this.appService.update(id, {
      cid,
      pid,
      quantity,
      orderAmount,
      deliveryDone,
      orderCancelled,
      deliveryDate,
      deliveryAddress,
      receiverPhone,
      paymentMethod,
    });
  }

  @Delete('/deleteOrder/:id')
  async delete(@Param('id') id: number): Promise<Order> {
    return await this.appService.delete(id);
  }
}
