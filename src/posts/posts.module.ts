import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostEntity } from "../entities/post.entity";
import { UserEntity } from "../entities/user.entity";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, UserEntity])],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
