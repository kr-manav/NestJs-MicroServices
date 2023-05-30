import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Order extends Document {
  @Prop({ required: true })
  cid: string;

  @Prop({ required: true })
  pid: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  orderAmount: number;

  @Prop({ required: true })
  deliveryDone: boolean;

  @Prop({ required: true, default: false })
  orderCancelled: boolean;

  @Prop({ required: true })
  deliveryDate: string;

  @Prop({ required: true })
  deliveryAddress: string;

  @Prop({ required: true })
  receiverPhone: string;

  @Prop({ required: true, default: 'COD' })
  paymentMethod: string;
}

export type OrderDocument = Order & Document;

export const OrderSchema = SchemaFactory.createForClass(Order);
