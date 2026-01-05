// src/posts/posts.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

// posts.service.ts
async create(dto: CreatePostDto, userId: string): Promise<Post> {
  const user = await this.userRepository.findOne({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  const post = this.postRepository.create({
    title: dto.title,
    content: dto.content,
    creator: user,
    creatorId: user.id,
  });

  return this.postRepository.save(post);
}


  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(id: string, dto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);

    Object.assign(post, dto);
    return this.postRepository.save(post);
  }

  async remove(id: string): Promise<void> {
    const post = await this.findOne(id);
    await this.postRepository.remove(post);
  }
}
