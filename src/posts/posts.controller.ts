import {
  Body,
  Controller, Delete,
  Get, HttpException, HttpStatus,
  Param,
  Post, Put,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDTO, UpdatePostDto } from "./post.dto";
import { ObjectId } from "mongodb";
import { JwtAuthGuard } from "../auth/auth.guard";
import { UserEntity } from "../entities/user.entity";
import { classToPlain } from "class-transformer";

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Body(ValidationPipe) createPostDto: CreatePostDTO, @Req() req: any) {
    const userId = req.user._id; // This should now contain the authenticated user's _id
    console.log('Authenticated User:', req.user); // Ensure user is being extracted
    console.log('Create Post DTO:', createPostDto);
    return this.postService.create(createPostDto, userId);
  }

  @Get(':id')
  async getPost(@Param('id') id: string) {
    const post = await this.postService.findById(id);
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return post;
  }

  @Get()
  async getAllPosts() {
    return this.postService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: any,
  ) {
    const userId = req.user._id; // Ensure the post belongs to the user
    return this.postService.update(id, updatePostDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: string, @Req() req: any) {
    const userId = req.user._id; // Ensure the post belongs to the user
    return this.postService.softDelete(id, userId);
  }
}
