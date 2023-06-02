import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class OrderInput {
  @Field({ nullable: true })
  cid: string;

  @Field()
  pid: string;

  @Field()
  quantity: number;

  @Field()
  orderAmount: number;

  @Field()
  deliveryDone: boolean;

  @Field()
  orderCancelled: boolean;

  @Field()
  deliveryDate: string;

  @Field()
  deliveryAddress: string;

  @Field()
  receiverPhone: string;

  @Field({ defaultValue: 'COD' })
  paymentMethod: string;
}

@InputType()
export class OrderUpdateInput {
  @Field()
  deliveryDone: boolean;

  @Field()
  orderCancelled: boolean;

  @Field()
  deliveryDate: string;

  @Field()
  deliveryAddress: string;

  @Field()
  receiverPhone: string;

  @Field({ defaultValue: 'COD' })
  paymentMethod: string;
}
