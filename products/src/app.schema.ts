import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@ObjectType()
export class Attributes {
  @Field({ nullable: false })
  @Prop({ required: true })
  cod: boolean;

  @Field({ nullable: false })
  @Prop({ required: true })
  color: string;

  @Field({ nullable: false })
  @Prop({ required: true })
  delivery: string;
}

@ObjectType()
@Schema()
export class Product extends Document {
  @Field({ nullable: false })
  @Prop({ required: true })
  cid: string;

  @Field({ nullable: false })
  @Prop({ required: true })
  title: string;

  @Field({ nullable: false })
  @Prop({ required: true })
  image: string;

  @Field({ nullable: false })
  @Prop({ required: true })
  description: string;

  @Field(() => Number, { nullable: false })
  @Prop({ required: true })
  quantity: number;

  @Field(() => Number, { nullable: false })
  @Prop({ required: true })
  price: number;

  @Field(() => Attributes, { nullable: false })
  @Prop({ required: true })
  attributes: Attributes;
}

export type ProductDocument = Product & Document;

export const ProductSchema = SchemaFactory.createForClass(Product);
