import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostEntity } from "../entities/post.entity";
import { Repository } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { CreatePostDTO, UpdatePostDto } from "./post.dto";
import { ObjectId } from "mongodb";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepo: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>
  ) {
  }

  async create(createPostDto: CreatePostDTO, userId: any): Promise<PostEntity> {
    console.log('user in service file', userId);
    const post = this.postRepo.create(createPostDto);
    post.userId = userId;
    return await this.postRepo.save(post);  // Save the post to the database
  }

  async findById(postId: string): Promise<PostEntity> {
    const post = await this.postRepo.findOne({
      where: { _id: new ObjectId(postId) },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async findAll(): Promise<PostEntity[]> {
    return this.postRepo.find({ relations: ['user'] });
  }

  async update(
    postId: string,
    updatePostDto: UpdatePostDto,
    userId: ObjectId,
  ): Promise<PostEntity> {
    const post = await this.postRepo.findOne({
      where: { _id: new ObjectId(postId) },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (!post.userId.equals(userId)) {
      throw new ForbiddenException('You can only update your own posts');
    }

    Object.assign(post, updatePostDto);

    await this.postRepo.save(post);

    return this.postRepo.findOne({
      where: { _id: post._id },
      relations: ['user'],
    });
  }

  async softDelete(postId: string, userId: ObjectId): Promise<void> {
    const post = await this.postRepo.findOne({
      where: { _id: new ObjectId(postId), deletedAt: null },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (!post.userId.equals(userId)) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    post.deletedAt = new Date(); // Mark as deleted
    await this.postRepo.save(post);
  }

}
