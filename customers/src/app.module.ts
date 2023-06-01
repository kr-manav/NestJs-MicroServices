import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema } from './app.schema';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from './jwt.service';
import { NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtMiddleware } from './jwt.middleware';
import { UserController } from './user.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { CustomerResolver } from './app.resolver';
import { CustomerInput } from './app.input';

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
    MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_TOKEN,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AppController, UserController],
  providers: [AppService, JwtAuthService, CustomerResolver, CustomerInput],
  exports: [JwtAuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('customers');
  }
}
