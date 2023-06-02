import { HttpService } from '@nestjs/axios';
import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { firstValueFrom } from 'rxjs';
import { OrderInput, OrderUpdateInput } from './app.input';
import { Order } from './app.schema';
import { AppService } from './app.service';
import { JwtAuthGuard } from './jwt-auth.guard';

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
  @UseGuards(JwtAuthGuard)
  async ordersByCustomer(@Context() context: any): Promise<Order[]> {
    return await this.appService.findAllByCID(context.req.user.id);
  }

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard)
  async create(
    @Args('input') input: OrderInput,
    @Context() context: any,
  ): Promise<Order> {
    input.cid = context.req.user.id;
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
  @UseGuards(JwtAuthGuard)
  async edit(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: OrderUpdateInput,
    @Context() context: any,
  ): Promise<Order> {
    const order = await this.appService.find(id);
    if (context.req.user.id != order.cid) {
      throw new Error('User not allowed');
    }
    return await this.appService.update(id, input);
  }

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard)
  async delete(
    @Args('id', { type: () => ID }) id: number,
    @Context() context: any,
  ): Promise<Order> {
    const order = await this.appService.find(id);
    if (context.req.user.id != order.cid) {
      throw new Error('User not allowed');
    }
    return await this.appService.delete(id);
  }
}
