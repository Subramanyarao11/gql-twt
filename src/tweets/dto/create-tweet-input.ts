import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

@InputType()
export class CreateTweetInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(280)
  content: string;

  @Field({ nullable: true })
  @IsOptional()
  image?: string;

  @Field({ nullable: true })
  @IsOptional()
  replyToId?: string;
}
