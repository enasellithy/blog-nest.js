import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentEntity } from "../entities/comment.entity";
import { PostEntity } from "../entities/post.entity";
import { UserEntity } from "../entities/user.entity";

@Module({
  providers: [CommentsService],
  controllers: [CommentsController],
  imports: [TypeOrmModule.forFeature([CommentEntity, PostEntity, UserEntity])],
  exports: [CommentsService],
})
export class CommentsModule {}
