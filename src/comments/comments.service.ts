import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommentEntity } from "../entities/comment.entity";
import { PostEntity } from "../entities/post.entity";
import { UserEntity } from "../entities/user.entity";
import { CreateCommentDTO } from "./comment.dto";
import { ObjectId } from "mongodb";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepo: Repository<CommentEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async create(
    createCommentDto: CreateCommentDTO,
    userId: ObjectId,
  ): Promise<CommentEntity> {
    // Validate the post exists
    const post = await this.postRepo.findOne({
      where: { _id: new ObjectId(createCommentDto.postId), deletedAt: null },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Validate the user exists
    const user = await this.userRepo.findOne({ where: { _id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create the comment
    const comment = this.commentRepo.create({
      content: createCommentDto.content,
      postId: new ObjectId(createCommentDto.postId),
      userId,
    });

    // Save the comment
    const savedComment = await this.commentRepo.save(comment);
    return savedComment; // Ensure the comment is returned
  }
  // async create(createCommentDto: CreateCommentDTO, userId: ObjectId): Promise<CommentEntity> {
  //   const post = await this.postRepo.findOne({
  //     where: { _id: new ObjectId(createCommentDto.postId), deletedAt: null },
  //   });
  //
  //   if (!post) {
  //     throw new NotFoundException('Post not found');
  //   }
  //
  //   const user = await this.userRepo.findOne({ where: { _id: userId } });
  //
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }
  //
  //   const comment = this.commentRepo.create({
  //     content: createCommentDto.content,
  //     postId: new ObjectId(createCommentDto.postId),
  //     userId,
  //   });
  //
  //   return this.commentRepo.save(comment);
  // }

  async findByPost(postId: string): Promise<CommentEntity[]> {
    return this.commentRepo.find({
      where: { postId: new ObjectId(postId) },
      relations: ['user'],
    });
  }
}
