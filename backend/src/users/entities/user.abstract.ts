import { User } from "./user.interface";

export enum UserRole {
    ATHLETE = 'athlete',
    COACH = 'coach',
  }

export abstract class AUser implements User {
    
    constructor(
    public id: number,
    public name: string,
    public email: string,
    public username: string,
    protected password: string,
    public role: UserRole) {}
}