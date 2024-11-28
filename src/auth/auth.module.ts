import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from "./jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import * as process from "node:process";
import * as dotenv from 'dotenv';
import { JwtAuthGuard } from "./auth.guard";
import { PostsModule } from "../posts/posts.module";

dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]), // Load UserEntity repository
    PassportModule.register({ defaultStrategy: 'jwt' }), // Register Passport JWT strategy
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '3h' }, // Token expiration time
    }),
    forwardRef(() => PostsModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
