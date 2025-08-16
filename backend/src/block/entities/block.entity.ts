import { Week } from './week.entity';

export class Block {
  constructor(
    public id: number,
    public name: string,
    public programId: number,
    public weeks: Week[],
  ) {}
}
