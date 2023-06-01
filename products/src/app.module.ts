import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './app.schema';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from './jwt.service';
import { NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtMiddleware } from './jwt.middleware';
import { ProductAPIController } from './productApi.controller';
import { AppResolver } from './app.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
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
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_TOKEN,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AppController, ProductAPIController],
  providers: [AppService, JwtAuthService, AppResolver],
  exports: [JwtAuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('products');
  }
}
