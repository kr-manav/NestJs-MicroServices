import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ProductInput, ProductUpdateInput } from './app.input';
import { Product } from './app.schema';
import { AppService } from './app.service';

@Resolver(() => Product)
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => [Product])
  async products(): Promise<Product[]> {
    return await this.appService.findAll();
  }

  @Query(() => Product)
  async product(@Args('id', { type: () => ID }) id: number): Promise<Product> {
    return await this.appService.find(id);
  }

  @Mutation(() => Product)
  async create(@Args('input') input: ProductInput): Promise<Product> {
    return await this.appService.create(input);
  }

  @Mutation(() => Product)
  async edit(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: ProductUpdateInput,
  ): Promise<Product> {
    return await this.appService.update(id, input);
  }

  @Mutation(() => Product)
  async delete(@Args('id', { type: () => ID }) id: number): Promise<Product> {
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
