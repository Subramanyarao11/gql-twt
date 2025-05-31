import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Tweet } from 'src/tweets/entities/tweet.entity';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  profileImage?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  coverImage?: string;

  @Field(() => [Tweet])
  @OneToMany(() => Tweet, (tweet) => tweet.author)
  tweets: Tweet[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  followersCount: number;

  @Field()
  followingCount: number;

  @Field()
  tweetsCount: number;

  @Field()
  isFollowing: boolean;
}
