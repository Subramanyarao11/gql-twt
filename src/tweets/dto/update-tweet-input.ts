import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';

@InputType()
export class UpdateTweetInput {
  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(280)
  content?: string;

  @Field({ nullable: true })
  @IsOptional()
  image?: string;
}
