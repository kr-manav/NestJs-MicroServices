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
import { AppResolver } from './app.resolver';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';
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
      secret: '123',
      signOptions: { expiresIn: '60m' },
    }),
    PassportModule,
  ],
  controllers: [AppController, UserController],
  providers: [
    AppService,
    JwtAuthService,
    AppResolver,
    JwtAuthGuard,
    JwtStrategy,
  ],
  exports: [JwtAuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('customers');
  }
}
