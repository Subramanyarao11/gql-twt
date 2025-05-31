import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tweet } from './entities/tweet.entity';
import { User } from '../users/entities/user.entity';
import { CreateTweetInput } from './dto/create-tweet-input';
import { UpdateTweetInput } from './dto/update-tweet-input';

@Injectable()
export class TweetsService {
  constructor(
    @InjectRepository(Tweet)
    private tweetRepository: Repository<Tweet>,
  ) {}

  async create(
    createTweetInput: CreateTweetInput,
    author: User,
  ): Promise<Tweet> {
    const tweet = this.tweetRepository.create({
      ...createTweetInput,
      authorId: author.id,
    });

    return this.tweetRepository.save(tweet);
  }

  async findAll(limit: number = 20, offset: number = 0): Promise<Tweet[]> {
    return this.tweetRepository.find({
      relations: ['author', 'likes', 'replies'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async findById(id: string): Promise<Tweet> {
    const tweet = await this.tweetRepository.findOne({
      where: { id },
      relations: ['author', 'likes', 'replies', 'replyTo'],
    });

    if (!tweet) {
      throw new NotFoundException('Tweet not found');
    }

    return tweet;
  }

  async findByAuthor(
    authorId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<Tweet[]> {
    return this.tweetRepository.find({
      where: { authorId },
      relations: ['author', 'likes', 'replies'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async findReplies(
    tweetId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<Tweet[]> {
    return this.tweetRepository.find({
      where: { replyToId: tweetId },
      relations: ['author', 'likes', 'replies'],
      order: { createdAt: 'ASC' },
      take: limit,
      skip: offset,
    });
  }

  async update(
    id: string,
    updateTweetInput: UpdateTweetInput,
    user: User,
  ): Promise<Tweet> {
    const tweet = await this.findById(id);

    if (tweet.authorId !== user.id) {
      throw new ForbiddenException('You can only update your own tweets');
    }

    await this.tweetRepository.update(id, updateTweetInput);
    return this.findById(id);
  }

  async remove(id: string, user: User): Promise<boolean> {
    const tweet = await this.findById(id);

    if (tweet.authorId !== user.id) {
      throw new ForbiddenException('You can only delete your own tweets');
    }

    const result = await this.tweetRepository.delete(id);
    return result.affected > 0;
  }

  async getTimeline(
    userId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<Tweet[]> {
    const query = this.tweetRepository
      .createQueryBuilder('tweet')
      .leftJoinAndSelect('tweet.author', 'author')
      .leftJoinAndSelect('tweet.likes', 'likes')
      .leftJoinAndSelect('tweet.replies', 'replies')
      .leftJoin('follows', 'follow', 'follow.followingId = tweet.authorId')
      .where('follow.followerId = :userId OR tweet.authorId = :userId', {
        userId,
      })
      .orderBy('tweet.createdAt', 'DESC')
      .take(limit)
      .skip(offset);

    return query.getMany();
  }
}
