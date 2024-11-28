import { IsNotEmpty, IsString } from "class-validator";

export class CreateCommentDTO {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  postId: string;
}