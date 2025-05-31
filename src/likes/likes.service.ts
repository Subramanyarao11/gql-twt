import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './enitites/like.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {}

  async likeTweet(userId: string, tweetId: string): Promise<Like> {
    const existingLike = await this.likeRepository.findOne({
      where: { userId, tweetId },
    });

    if (existingLike) {
      throw new ConflictException('Tweet already liked');
    }

    const like = this.likeRepository.create({
      userId,
      tweetId,
    });

    return this.likeRepository.save(like);
  }

  async unlikeTweet(userId: string, tweetId: string): Promise<boolean> {
    const like = await this.likeRepository.findOne({
      where: { userId, tweetId },
    });

    if (!like) {
      throw new NotFoundException('Like not found');
    }

    const result = await this.likeRepository.delete(like.id);
    return result.affected > 0;
  }

  async getTweetLikes(
    tweetId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<Like[]> {
    return this.likeRepository.find({
      where: { tweetId },
      relations: ['user'],
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
  }

  async getUserLikes(
    userId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<Like[]> {
    return this.likeRepository.find({
      where: { userId },
      relations: ['tweet', 'tweet.author'],
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
  }

  async isLiked(userId: string, tweetId: string): Promise<boolean> {
    const like = await this.likeRepository.findOne({
      where: { userId, tweetId },
    });

    return !!like;
  }

  async getLikesCount(tweetId: string): Promise<number> {
    return this.likeRepository.count({
      where: { tweetId },
    });
  }
}
