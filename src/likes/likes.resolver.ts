import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Like } from './enitites/like.entity';

@Resolver(() => Like)
export class LikesResolver {
  constructor(private likesService: LikesService) {}

  @Query(() => [Like])
  async tweetLikes(
    @Args('tweetId') tweetId: string,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
  ): Promise<Like[]> {
    return this.likesService.getTweetLikes(tweetId, limit, offset);
  }

  @Query(() => [Like])
  @UseGuards(JwtAuthGuard)
  async myLikes(
    @CurrentUser() user: User,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
  ): Promise<Like[]> {
    return this.likesService.getUserLikes(user.id, limit, offset);
  }

  @Mutation(() => Like)
  @UseGuards(JwtAuthGuard)
  async likeTweet(
    @Args('tweetId') tweetId: string,
    @CurrentUser() user: User,
  ): Promise<Like> {
    return this.likesService.likeTweet(user.id, tweetId);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async unlikeTweet(
    @Args('tweetId') tweetId: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.likesService.unlikeTweet(user.id, tweetId);
  }
}
