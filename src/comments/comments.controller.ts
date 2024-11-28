import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { JwtAuthGuard } from "../auth/auth.guard";
import { CreateCommentDTO } from "./comment.dto";

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(
    @Body() createCommentDto: CreateCommentDTO,
    @Req() req: any,
  ) {
    const userId = req.user._id; // Assumes `req.user` is populated by `JwtAuthGuard`
    return this.commentsService.create(createCommentDto, userId);
  }
}
