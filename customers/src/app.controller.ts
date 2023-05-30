import { Body, Controller, Put, Delete, Param } from '@nestjs/common';
import { Customer } from './app.schema';
import { AppService } from './app.service';

@Controller('customers/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Put('/edit/:id')
  async edit(
    @Param('id') id: number,
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('address') address: string,
    @Body('phone') phone: string,
    @Body('passsword') passsword: string,
  ): Promise<Customer> {
    const user = await this.appService.findByID(id);
    if (user.email != email) {
      const userPresent = await this.appService.findByEmail(email);
      if (userPresent) {
        throw new Error('User already Present- Email already registered');
      }
    }
    return await this.appService.update(id, {
      name,
      email,
      address,
      phone,
      passsword,
    });
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id: number): Promise<Customer> {
    return await this.appService.delete(id);
  }
}
