import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from './entities/tweet.entity';
import { TweetsService } from './tweets.service';
import { TweetsResolver } from './tweets.resolver';
import { UploadsModule } from 'src/upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tweet]), UploadsModule],
  providers: [TweetsService, TweetsResolver],
  exports: [TweetsService],
})
export class TweetsModule {}
