export enum UserRole {
    ATHLETE = 'athlete',
    COACH = 'coach',
  }

export abstract class AUser  {
    
    constructor(
    public id: number,
    public name: string,
    public username: string,
    public email: string,
    public role: UserRole) {}
}