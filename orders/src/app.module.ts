import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './app.schema';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from './jwt.service';
import { NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtMiddleware } from './jwt.middleware';
import { HttpModule } from '@nestjs/axios';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppResolver } from './app.resolver';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      expandVariables: true,
      cache: true,
      envFilePath: './src/.env',
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      driver: ApolloDriver,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_TOKEN,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtAuthService, AppResolver],
  exports: [JwtAuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('orders');
  }
}
