import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomerDocument, Customer } from './app.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
  ) {}

  async findAll(): Promise<Customer[]> {
    return await this.customerModel.find({}).exec();
  }

  async findByEmail(email: string): Promise<Customer> {
    return await this.customerModel.findOne({ email: email }).exec();
  }

  async findByID(id: number): Promise<Customer> {
    return await this.customerModel.findOne({ _id: id }).exec();
  }

  async create(input: any): Promise<Customer> {
    const newCustomer = await this.customerModel.create(input);
    return newCustomer.save();
  }

  async update(id: number, input: any): Promise<Customer> {
    const updatedCustomer = await this.customerModel
      .findByIdAndUpdate({ _id: id }, input)
      .exec();
    return updatedCustomer;
  }

  async delete(id: number): Promise<Customer> {
    const deletedCustomer = await this.customerModel
      .findByIdAndDelete({ _id: id })
      .exec();
    return deletedCustomer;
  }
}
