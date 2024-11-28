import { BeforeInsert, Column, Entity, JoinColumn, ManyToMany, ManyToOne } from "typeorm";
import { BasesEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { ObjectId } from "mongodb";
import { PostEntity } from "./post.entity";

@Entity('comments')
export class CommentEntity extends BasesEntity{
  @Column()
  content: string;
  @ManyToMany(() => UserEntity, (user) => user.comments)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
  @Column()
  userId: ObjectId;
  @ManyToOne(() => PostEntity, (post) => post.comments)
  @JoinColumn({ name: 'postId' })
  post: PostEntity;

  @Column()
  postId: ObjectId;

  @BeforeInsert()
  async setUserAndPostIds() {
    if (!this.userId || !this.postId) {
      throw new Error('User ID or Post ID is not set');
    }
  }

}