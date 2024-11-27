import { Entity, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IsEmail, Length } from 'class-validator';
import { classToPlain, Exclude } from "class-transformer";
import { BasesEntity } from "./base.entity";
// import { ObjectId } from 'mongodb';

@Entity('users') // Ensure this is the correct collection name
export class UserEntity extends BasesEntity{
  @IsEmail()
  @Column({ unique: true }) // Ensure email is unique
  email: string;

  @Column({ unique: true }) // Ensure username is unique
  username: string;

  @Column({ default: '' })
  bio: string;

  @Column({ nullable: true })
  image: string | null;

  @Column()
  @Exclude()
  @Length(4, 100)
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }
  toJSON() {
    const plain = classToPlain(this); // Convert the entity to plain object
    const { _id, createdAt, updatedAt, deletedAt, ...rest } = plain; // Destructure to separate the fields

    return {
      _id: this._id.toHexString(),
      ...rest,
      createdAt,
      updatedAt,
      deletedAt,
    };
  }
}
