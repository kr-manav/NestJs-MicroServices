// book.input.ts
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CustomerInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  address: string;

  @Field()
  phone: string;

  @Field()
  password: string;
}

@InputType()
export class CustomerUpdateInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  address: string;

  @Field()
  phone: string;
}
