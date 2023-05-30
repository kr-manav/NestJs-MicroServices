import {
  Body,
  Controller,
  Get,
  Post
} from '@nestjs/common';
import { Customer } from './app.schema';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { JwtAuthService } from './jwt.service';

@Controller('users/')
export class UserController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtAuthService,
  ) {}

  @Get()
  async all(): Promise<Customer[]> {
    return await this.appService.findAll();
  }

  @Post('/register')
  async create(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('address') address: string,
    @Body('phone') phone: string,
    @Body('password') password: string,
  ): Promise<Customer> {
    const userPresent = await this.appService.findByEmail(email);
    if (userPresent) {
      throw new Error('User already Present- Email already registered');
    }
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    return await this.appService.create({
      name,
      email,
      address,
      phone,
      password: hashedPassword,
    });
  }

  @Post('/login')
  async signIn(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<any> {
    const userPresent = await this.appService.findByEmail(email);
    if (userPresent && bcrypt.compare(password, userPresent.password)) {
      const access_token = await this.jwtService.signPayload({
        id: userPresent._id,
        email: email,
      });
      return access_token;
    }
  }
}
