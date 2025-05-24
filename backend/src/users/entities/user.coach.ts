import { AUser, UserRole } from "./user.abstract";
import { Athlete } from "./user.athlete";

export class Coach extends AUser {
    constructor(
        public id: number,
        public name: string,
        public email: string,
        public username: string,
        protected password: string,
        public role: UserRole,
        public athletes: Athlete[]
        ) {
            super(id, name, email, username, password, role);
        }
}