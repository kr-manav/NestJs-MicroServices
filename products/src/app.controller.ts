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
}
