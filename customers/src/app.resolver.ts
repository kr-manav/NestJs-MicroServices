/* eslint-disable prettier/prettier */
// app.resolver.ts
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Customer } from './app.schema';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { JwtAuthService } from './jwt.service';
import { CustomerInput, CustomerUpdateInput } from './app.input';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly appService: AppService, private readonly jwtService:JwtAuthService) {}

  @Query(() => [Customer])
  async customers(): Promise<Customer[]> {
    return this.appService.findAll();
  }

  @Query(() => Customer)
  async customer(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<Customer> {
    return this.appService.findByID(id);
  }

  @Mutation(() => Customer)
  async register(
    @Args('input') input: CustomerInput
    ){
    const userPresent = await this.appService.findByEmail(input.email);
    if (userPresent) {
      throw new Error('User already Present- Email already registered');
    }
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(input.password, saltOrRounds);
    input.password = hashedPassword
    return await this.appService.create(input);
  }

  @Mutation(() => Customer)
  async login(
    @Args('email', { type: () => String }) email: string,
    @Args('password', { type: () => String }) password: string,
  ){
    const userPresent = await this.appService.findByEmail(email);
    if (userPresent && bcrypt.compare(password, userPresent.password)) {
      const access_token = await this.jwtService.signPayload({
        id: userPresent._id,
        email: email,
      });
      return access_token;
    } else {
        return null
    }
  }

  @Mutation(() => Customer)
  async edit(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: CustomerUpdateInput,
  ){
    const user = await this.appService.findByID(id);
    if (user.email != input.email) {
      const userPresent = await this.appService.findByEmail(input.email);
      if (userPresent) {
        throw new Error('User already Present- Email already registered');
      }
    }
    return await this.appService.update(id, input);
  }

  @Mutation(() => Customer)
  async delete(
    @Args('id', { type: () => ID }) id: number,
  ){
    return await this.appService.delete(id);
  }
}
