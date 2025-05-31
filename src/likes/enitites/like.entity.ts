import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Unique,
  Column,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Tweet } from '../../tweets/entities/tweet.entity';

@ObjectType()
@Entity('likes')
@Unique(['userId', 'tweetId'])
export class Like {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Field(() => Tweet)
  @ManyToOne(() => Tweet, (tweet) => tweet.likes)
  @JoinColumn({ name: 'tweetId' })
  tweet: Tweet;

  @Column()
  tweetId: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
