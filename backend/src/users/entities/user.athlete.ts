import { AUser, UserRole } from "./user.abstract";

export class Athlete extends AUser {
    constructor(
    public id: number,
    public name: string,
    public username: string,
    public email: string,
    public role: UserRole,
    public coachId: string,
    public weightClass: string,
    public team: string,
    public division: string,
    ) {
        super(id, name, username, email, role);
    }
}