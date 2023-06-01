import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Schema()
export class Customer extends Document {
  @Field({ nullable: false })
  @Prop({ required: true })
  name: string;

  @Field(() => String, { nullable: false })
  @Prop({ required: true })
  email: string;

  @Field({ nullable: false })
  @Prop({ required: true })
  address: string;

  @Field(() => String, { nullable: false })
  @Prop({ required: true })
  phone: string;

  @Field(() => String, { nullable: false })
  @Prop({ required: true })
  password: string;
}

export type CustomerDocument = Customer & Document;

export const CustomerSchema = SchemaFactory.createForClass(Customer);
