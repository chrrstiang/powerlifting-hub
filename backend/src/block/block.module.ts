import { Module } from '@nestjs/common';
import { BlockService } from './service/block.service';
import { BlockController } from './controller/block.controller';

// represents a training block in a program. 
@Module({
  controllers: [BlockController],
  providers: [BlockService],
})
export class BlockModule {}
