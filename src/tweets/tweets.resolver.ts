import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Tweet } from './entities/tweet.entity';
import { TweetsService } from './tweets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CreateTweetInput } from './dto/create-tweet-input';
import { UpdateTweetInput } from './dto/update-tweet-input';
import GraphQLUpload, { FileUpload } from 'graphql-upload/GraphQLUpload.mjs';

@Resolver(() => Tweet)
export class TweetsResolver {
  constructor(private tweetsService: TweetsService) {}

  @Query(() => [Tweet])
  async tweets(
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
  ): Promise<Tweet[]> {
    return this.tweetsService.findAll(limit, offset);
  }

  @Query(() => Tweet)
  async tweet(@Args('id') id: string): Promise<Tweet> {
    return this.tweetsService.findById(id);
  }

  @Query(() => [Tweet])
  async userTweets(
    @Args('userId') userId: string,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
  ): Promise<Tweet[]> {
    return this.tweetsService.findByAuthor(userId, limit, offset);
  }

  @Query(() => [Tweet])
  @UseGuards(JwtAuthGuard)
  async timeline(
    @CurrentUser() user: User,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
  ): Promise<Tweet[]> {
    return this.tweetsService.getTimeline(user.id, limit, offset);
  }

  @Query(() => [Tweet])
  async tweetReplies(
    @Args('tweetId') tweetId: string,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
  ): Promise<Tweet[]> {
    return this.tweetsService.findReplies(tweetId, limit, offset);
  }

  @Mutation(() => Tweet)
  @UseGuards(JwtAuthGuard)
  async createTweet(
    @Args('input') createTweetInput: CreateTweetInput,
    @CurrentUser() user: User,
  ): Promise<Tweet> {
    return this.tweetsService.create(createTweetInput, user);
  }

  @Mutation(() => Tweet)
  @UseGuards(JwtAuthGuard)
  async createTweetWithImage(
    @Args('input') createTweetInput: CreateTweetInput,
    @Args('file', { type: () => GraphQLUpload, nullable: true })
    file: FileUpload,
    @CurrentUser() user: User,
  ): Promise<Tweet> {
    return this.tweetsService.createWithImage(createTweetInput, file, user);
  }

  @Mutation(() => Tweet)
  @UseGuards(JwtAuthGuard)
  async updateTweet(
    @Args('id') id: string,
    @Args('input') updateTweetInput: UpdateTweetInput,
    @CurrentUser() user: User,
  ): Promise<Tweet> {
    return this.tweetsService.update(id, updateTweetInput, user);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteTweet(
    @Args('id') id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.tweetsService.remove(id, user);
  }

  @ResolveField(() => Int)
  async repliesCount(@Parent() tweet: Tweet): Promise<number> {
    return tweet.replies?.length || 0;
  }

  @ResolveField(() => Int)
  async likesCount(@Parent() tweet: Tweet): Promise<number> {
    return tweet.likes?.length || 0;
  }

  @ResolveField(() => Boolean)
  async isLiked(
    @Parent() tweet: Tweet,
    @CurrentUser() user?: User,
  ): Promise<boolean> {
    if (!user) return false;
    return tweet.likes?.some((like) => like.userId === user.id) || false;
  }
}
