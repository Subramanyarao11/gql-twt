import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateUserInput } from './dto/update-user.inpu';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User)
  async user(@Args('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser() user: User,
    @Args('input') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.update(user.id, updateUserInput);
  }

  @ResolveField(() => Number)
  async followersCount(@Parent() user: User): Promise<number> {
    return user.followersCount;
  }

  @ResolveField(() => Number)
  async followingCount(@Parent() user: User): Promise<number> {
    return user.followingCount;
  }

  @ResolveField(() => Number)
  async tweetsCount(@Parent() user: User): Promise<number> {
    return user.tweetsCount;
  }

  @ResolveField(() => Boolean)
  async isFollowing(@Parent() user: User): Promise<boolean> {
    return user.isFollowing;
  }
}
