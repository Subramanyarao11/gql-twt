import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesService } from './likes.service';
import { LikesResolver } from './likes.resolver';
import { Like } from './enitites/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like])],
  providers: [LikesService, LikesResolver],
  exports: [LikesService],
})
export class LikesModule {}
