import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Follow } from './entities/follow.entity';
import { User } from '../users/entities/user.entity';
import { FollowsService } from './follows.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Resolver(() => Follow)
export class FollowsResolver {
  constructor(private followsService: FollowsService) {}

  @Query(() => [User])
  async followers(
    @Args('userId') userId: string,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
  ): Promise<User[]> {
    return this.followsService.getFollowers(userId, limit, offset);
  }

  @Query(() => [User])
  async following(
    @Args('userId') userId: string,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
  ): Promise<User[]> {
    return this.followsService.getFollowing(userId, limit, offset);
  }

  @Mutation(() => Follow)
  @UseGuards(JwtAuthGuard)
  async followUser(
    @Args('userId') userId: string,
    @CurrentUser() user: User,
  ): Promise<Follow> {
    return this.followsService.follow(user.id, userId);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async unfollowUser(
    @Args('userId') userId: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.followsService.unfollow(user.id, userId);
  }
}
