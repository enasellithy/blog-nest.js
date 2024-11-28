import { Entity, Column, ManyToOne, JoinColumn, BeforeInsert, OneToMany } from "typeorm";
import { IsNotEmpty, IsString } from "class-validator";
import { BasesEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { ObjectId } from "mongodb";
import { classToPlain } from "class-transformer";
import { CommentEntity } from "./comment.entity";
// import { UserEntity } from "./user.entity";

@Entity('posts')
export class PostEntity extends BasesEntity{
  @Column()
  @IsNotEmpty()
  @IsString()
  title: string;
  @Column()
  @IsNotEmpty()
  content: string;
  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  userId: ObjectId;

  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments: CommentEntity[];

  toJSON() {
    const plain = { ...this };
    const { _id, createdAt, updatedAt, deletedAt, userId, ...rest } = plain;

    // If userId is provided, transform it to include user info
    const transformedUserId = this.user
      ? {
        userId: this.user._id.toHexString(),
        username: this.user.username,
        email: this.user.email,
      }
      : { userId: userId.toHexString() };

    return {
      _id: _id.toHexString(),
      user: transformedUserId,
      ...rest,
      createdAt,
      updatedAt,
      deletedAt,
    };
  }
}