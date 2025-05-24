import { Program } from "src/program/entities/program.entity";
import { AUser, UserRole } from "./user.abstract";
import { Coach } from "./user.coach";

export class Athlete extends AUser {
    constructor(
    public id: number,
    public name: string,
    public email: string,
    public username: string,
    protected password: string,
    public role: UserRole,
    public coach: Coach,
    public program: Program
    ) {
        super(id, name, email, username, password, role);
    }
}