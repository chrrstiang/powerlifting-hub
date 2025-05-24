import { Injectable } from '@nestjs/common';
import { CreateBlockDto } from '../dto/create-block.dto';
import { UpdateBlockDto } from '../dto/update-block.dto';

@Injectable()
export class BlockService {
  create(createBlockDto: CreateBlockDto) {
    return 'This action adds a new block to an Athletes program';
  }

  findAllWorkouts() {
    return `This action returns all workouts in a block`;
  }

  findOne(id: number) {
    return `This action returns an Athletes block using the block id`;
  }

  update(id: number, updateBlockDto: UpdateBlockDto) {
    return `This action updates an Athletes block using the block id`;
  }

  remove(id: number) {
    return `This action deletes an Athletes block using the block id`;
  }
}
