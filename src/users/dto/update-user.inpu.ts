import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(50)
  displayName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(160)
  bio?: string;

  @Field({ nullable: true })
  @IsOptional()
  profileImage?: string;

  @Field({ nullable: true })
  @IsOptional()
  coverImage?: string;
}
