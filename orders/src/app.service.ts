import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderDocument, Order } from './app.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async findAll(): Promise<Order[]> {
    return await this.orderModel.find({}).exec();
  }

  async findAllByCID(id: number): Promise<Order[]> {
    return await this.orderModel.find({ cid: id }).exec();
  }

  async find(id: number): Promise<Order> {
    return await this.orderModel.findOne({ _id: id }).exec();
  }

  async create(input): Promise<Order> {
    const newOrder = await this.orderModel.create(input);
    return newOrder.save();
  }

  async update(id: number, input): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate({ _id: id }, input, { new: true })
      .exec();
    return updatedOrder;
  }

  async delete(id: number): Promise<Order> {
    const deletedOrder = await this.orderModel
      .findByIdAndDelete({ _id: id })
      .exec();
    return deletedOrder;
  }
}
