export enum UserRole {
    ATHLETE = 'athlete',
    COACH = 'coach',
  }

export abstract class AUser  {
    
    constructor(
    public id: number,
    public name: string,
    public email: string,
    public username: string,
    protected password: string,
    public role: UserRole) {}
}