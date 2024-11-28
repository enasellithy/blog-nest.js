import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'node:process';
import * as dotenv from 'dotenv';
import { UserEntity } from './entities/user.entity';
import { PostsService } from './posts/posts.service';
import { PostsController } from './posts/posts.controller';
import { PostsModule } from './posts/posts.module';
import { PostEntity } from "./entities/post.entity";
import { CommentsModule } from './comments/comments.module';
import { CommentsService } from "./comments/comments.service";
import { CommentsController } from "./comments/comments.controller";
import { CommentEntity } from "./entities/comment.entity";
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://localhost:27017/crud',
      synchronize: true,
      logging: true,
      useUnifiedTopology: true,
      entities: [UserEntity, PostEntity, CommentEntity],
    }),
    TypeOrmModule.forFeature([UserEntity, PostEntity, CommentEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '3h' },
    }),
    AuthModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [AppController, PostsController, CommentsController],
  providers: [AppService, PostsService],
})
export class AppModule {}
