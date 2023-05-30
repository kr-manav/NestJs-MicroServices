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
import { Product } from './app.schema';
import { AppService } from './app.service';
import { Request } from '@nestjs/common';
import { Response } from 'express';

@Controller('products')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async all(): Promise<Product[]> {
    return await this.appService.findAll();
  }

  @Post('/create')
  async create(
    @Req() req: Request,
    @Body('title') title: string,
    @Body('image') image: string,
    @Body('description') description: string,
    @Body('quantity') quantity: number,
    @Body('price') price: number,
    @Body('cod') cod: boolean,
    @Body('color') color: string,
    @Body('delivery') delivery: string,
  ): Promise<Product> {
    return await this.appService.create({
      cid: req['user'].id,
      title,
      image,
      description,
      quantity,
      price,
      attributes: {
        cod,
        color,
        delivery,
      },
    });
  }

  @Put('/edit/:id')
  async edit(
    @Param('id') id: number,
    @Body('title') title: string,
    @Body('image') image: string,
    @Body('description') description: string,
    @Body('quantity') quantity: number,
    @Body('price') price: number,
    @Body('cod') cod: boolean,
    @Body('color') color: string,
    @Body('delivery') delivery: string,
  ): Promise<Product> {
    return await this.appService.update(id, {
      title,
      image,
      description,
      quantity,
      price,
      attributes: {
        cod,
        color,
        delivery,
      },
    });
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id: number): Promise<Product> {
    return await this.appService.delete(id);
  }

  @Post('/checkQuantity/:pid/:quantity')
  async checkQuantity(
    @Param('pid') pid: number,
    @Param('quantity') quantity: number,
    @Res() res: Response,
  ): Promise<boolean> {
    res.status(200).json({
      message: this.appService.checkQuantity(pid, quantity),
    });
    return true;
  }

  @Post('/getPrice/:pid/')
  async getPrice(
    @Param('pid') pid: number,
    @Res() res: Response,
  ): Promise<number> {
    const price = this.appService.getPrice(pid);
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
    const product = this.appService.decreaseQuantity(pid, quantity);
    if (product) {
      res.status(200).json({
        message: true,
      });
    }
  }
}
