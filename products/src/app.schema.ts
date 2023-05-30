import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class Attributes {
  @Prop({ required: true })
  cod: boolean;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  delivery: string;
}

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  cid: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  attributes: Attributes;
}

export type ProductDocument = Product & Document;

export const ProductSchema = SchemaFactory.createForClass(Product);
