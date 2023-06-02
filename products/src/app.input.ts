import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AttributesInput {
  @Field()
  cod: boolean;

  @Field()
  color: string;

  @Field()
  delivery: string;
}

@InputType()
export class ProductInput {
  @Field({ nullable: true })
  cid: string;

  @Field()
  title: string;

  @Field()
  image: string;

  @Field()
  description: string;

  @Field()
  quantity: number;

  @Field()
  price: number;

  @Field(() => AttributesInput)
  attributes: AttributesInput;
}

@InputType()
export class ProductUpdateInput {
  @Field()
  image: string;

  @Field()
  description: string;

  @Field()
  quantity: number;

  @Field()
  price: number;

  @Field(() => AttributesInput)
  attributes: AttributesInput;
}
