import { Module } from '@nestjs/common';
import { UploadsService } from './upload.service';

@Module({
  providers: [UploadsService],
  exports: [UploadsService],
})
export class UploadsModule {}
