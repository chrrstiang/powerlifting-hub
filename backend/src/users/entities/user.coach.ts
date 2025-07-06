import { AUser, UserRole } from "./user.abstract";
import { Athlete } from "./user.athlete";

export class Coach extends AUser {
    constructor(
        public id: number,
        public name: string,
        public username: string,
        public email: string,
        public role: UserRole,
        public athletes: Athlete[]
        ) {
            super(id, name, username, email, role);
        }
}