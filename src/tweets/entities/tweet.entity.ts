import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
@Entity('tweets')
export class Tweet {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ length: 280 })
  content: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  image?: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.tweets)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  authorId: string;

  @Field(() => Tweet, { nullable: true })
  @ManyToOne(() => Tweet, (tweet) => tweet.replies, { nullable: true })
  @JoinColumn({ name: 'replyToId' })
  replyTo?: Tweet;

  @Column({ nullable: true })
  replyToId?: string;

  @Field(() => [Tweet])
  @OneToMany(() => Tweet, (tweet) => tweet.replyTo)
  replies: Tweet[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  likesCount: number;

  @Field()
  repliesCount: number;

  @Field()
  isLiked: boolean;
}
