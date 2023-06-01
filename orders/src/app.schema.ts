import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@ObjectType()
@Schema()
export class Order extends Document {
  @Field()
  @Prop({ required: true })
  cid: string;

  @Field()
  @Prop({ required: true })
  pid: string;

  @Field()
  @Prop({ required: true })
  quantity: number;

  @Field()
  @Prop({ required: true })
  orderAmount: number;

  @Field()
  @Prop({ required: true })
  deliveryDone: boolean;

  @Field()
  @Prop({ required: true, default: false })
  orderCancelled: boolean;

  @Field()
  @Prop({ required: true })
  deliveryDate: string;

  @Field()
  @Prop({ required: true })
  deliveryAddress: string;

  @Field()
  @Prop({ required: true })
  receiverPhone: string;

  @Field()
  @Prop({ required: true, default: 'COD' })
  paymentMethod: string;
}

export type OrderDocument = Order & Document;

export const OrderSchema = SchemaFactory.createForClass(Order);
