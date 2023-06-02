/* eslint-disable prettier/prettier */
// app.resolver.ts
import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { Customer } from './app.schema';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { JwtAuthService } from './jwt.service';
import { CustomerInput, CustomerUpdateInput } from './app.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Resolver(() => Customer)
export class AppResolver {
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

  @Mutation(() => String)
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
  @UseGuards(JwtAuthGuard)
  async edit(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: CustomerUpdateInput,
    @Context() context: any,  
  ){
    console.log("🚀 ~ file: app.resolver.ts:66 ~ CustomerResolver ~ context:", context.req.user)
    if (context.req.user.id != id) {
      throw new Error('User not allowed');
    }
    const user = await this.appService.findByID(id);
    if (user.email != input.email) {
      const userPresent = await this.appService.findByEmail(input.email);
      if (userPresent) {
        throw new Error('User already Present- Email already registered');
      }
    }
    return await this.appService.update(id, input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Customer)
  async delete(
    @Context() context: any,  
    @Args('id', { type: () => ID }) id: number,
  ){
    if (context.req.user.id != id) {
      throw new Error('User not allowed');
    }
    return await this.appService.delete(id);
  }
}
