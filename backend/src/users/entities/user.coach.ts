import { AUser } from "./user.abstract";
import { Athlete } from "./user.athlete";

export class Coach extends AUser {
    athletes: Athlete[];
}