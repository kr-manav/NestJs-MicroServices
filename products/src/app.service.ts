import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDocument, Product } from './app.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productModel.find({}).exec();
  }

  async findAllByCID(id: number): Promise<Product[]> {
    return await this.productModel.find({ cid: id }).exec();
  }

  async find(id: number): Promise<Product> {
    return await this.productModel.findOne({ _id: id }).exec();
  }

  async create(input): Promise<Product> {
    const newProduct = await this.productModel.create(input);
    return newProduct.save();
  }

  async update(id: number, input): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate({ _id: id }, input, { new: true })
      .exec();
    return updatedProduct;
  }

  async delete(id: number): Promise<Product> {
    const deletedProduct = await this.productModel
      .findByIdAndDelete({ _id: id })
      .exec();
    return deletedProduct;
  }

  async checkQuantity(pid: number, quantity: number): Promise<boolean> {
    const product = await this.productModel.findById(pid);
    return product.quantity - quantity >= 0;
  }

  async getPrice(pid: number): Promise<number> {
    const product = await this.productModel.findById(pid);
    return product.price;
  }

  async decreaseQuantity(pid: number, quantity: number): Promise<Product> {
    const product = await this.productModel.findById(pid);

    return await this.productModel
      .findByIdAndUpdate(
        { _id: pid },
        { quantity: product.quantity - quantity },
        { new: true },
      )
      .exec();
  }
}
