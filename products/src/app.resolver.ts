import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { ProductInput, ProductUpdateInput } from './app.input';
import { Product } from './app.schema';
import { AppService } from './app.service';
import { JwtAuthGuard } from './jwt-auth.guard';
@Resolver(() => Product)
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => [Product])
  @UseGuards(JwtAuthGuard)
  async products(@Context() context: any): Promise<Product[]> {
    return await this.appService.findAllByCID(context.req.user.id);
  }

  @Query(() => Product)
  async product(@Args('id', { type: () => ID }) id: number): Promise<Product> {
    return await this.appService.find(id);
  }

  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard)
  async create(
    @Args('input') input: ProductInput,
    @Context() context: any,
  ): Promise<Product> {
    input.cid = context.req.user.id;
    return await this.appService.create(input);
  }

  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard)
  async edit(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: ProductUpdateInput,
    @Context() context: any,
  ): Promise<Product> {
    const product = await this.appService.find(id);
    if (context.req.user.id != product.cid) {
      throw new Error('User not alllowed');
    }
    return await this.appService.update(id, input);
  }

  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard)
  async delete(
    @Args('id', { type: () => ID }) id: number,
    @Context() context: any,
  ): Promise<Product> {
    const product = await this.appService.find(id);
    if (context.req.user.id != product.cid) {
      throw new Error('User not alllowed');
    }
    return await this.appService.delete(id);
  }

  @Query(() => Boolean)
  async checkQuantity(
    @Args('pid', { type: () => ID }) pid: number,
    @Args('quantity') quantity: number,
  ): Promise<boolean> {
    return await this.appService.checkQuantity(pid, quantity);
  }

  @Query(() => Number)
  async getPrice(
    @Args('pid', { type: () => ID }) pid: number,
  ): Promise<number> {
    const price = await this.appService.getPrice(pid);
    return price;
  }

  @Mutation(() => Product)
  async decreaseQuantity(
    @Args('pid', { type: () => ID }) pid: number,
    @Args('quantity') quantity: number,
  ) {
    const product = this.appService.decreaseQuantity(pid, quantity);
    return product;
  }
}
