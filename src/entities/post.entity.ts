import { Entity, Column } from "typeorm";
import { IsNotEmpty, IsString } from "class-validator";
import { BasesEntity } from "./base.entity";
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
  // @ManyToOne(() => UserEntity, (user) => user.posts)
  // @JoinColumn({ name: 'userId' })
  // user: UserEntity;
  @Column()
  userId: number;
}