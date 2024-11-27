import { Entity, Column, BeforeInsert, ObjectIdColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IsEmail, Length } from 'class-validator';
import { classToPlain, Exclude } from "class-transformer";
import { ObjectId } from 'mongodb';

@Entity('users') // Ensure this is the correct collection name
export class UserEntity {
  @ObjectIdColumn() // MongoDB's _id field is automatically generated as an ObjectId
  _id: ObjectId;

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
    return {
      ...classToPlain(this),
      _id: this._id.toHexString(),
    }
  }
}
