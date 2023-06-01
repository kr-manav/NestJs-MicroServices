import { HttpService } from '@nestjs/axios';
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { firstValueFrom } from 'rxjs';
import { OrderInput, OrderUpdateInput } from './app.input';
import { Order } from './app.schema';
import { AppService } from './app.service';

@Resolver(() => Order)
export class AppResolver {
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService,
  ) {}
  @Query(() => [Order])
  async orders(): Promise<Order[]> {
    return await this.appService.findAll();
  }

  @Query(() => Order)
  async order(@Args('id', { type: () => ID }) id: number): Promise<Order> {
    return await this.appService.find(id);
  }

  @Query(() => [Order])
  async ordersByCustomer(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<Order[]> {
    return await this.appService.findAllByCID(id);
  }

  @Mutation(() => Order)
  async create(@Args('input') input: OrderInput): Promise<Order> {
    const responseCheckQuantity = await firstValueFrom(
      this.httpService
        .post(
          `http://localhost:5001/api/productsHandler/checkQuantity/${input.pid}/${input.quantity}`,
        )
        .pipe(),
    );

    if (responseCheckQuantity.data.message) {
      const responsePrice = await firstValueFrom(
        this.httpService
          .post(
            `http://localhost:5001/api/productsHandler/getPrice/${input.pid}`,
          )
          .pipe(),
      );
      const orderAmount = input.quantity * responsePrice.data.message;
      const responseDecreaseQuantity = await firstValueFrom(
        this.httpService
          .post(
            `http://localhost:5001/api/productsHandler/decreaseQuantity/${input.pid}/${input.quantity}`,
          )
          .pipe(),
      );
      input.orderAmount = orderAmount;
      if (responseDecreaseQuantity.data.message) {
        return await this.appService.create(input);
      } else {
        return;
      }
    } else {
      return;
    }
  }

  @Mutation(() => Order)
  async edit(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: OrderUpdateInput,
  ): Promise<Order> {
    return await this.appService.update(id, input);
  }

  @Mutation(() => Order)
  async delete(@Args('id', { type: () => ID }) id: number): Promise<Order> {
    return await this.appService.delete(id);
  }
}
