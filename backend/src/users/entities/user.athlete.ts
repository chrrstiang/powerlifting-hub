import { AUser } from "./user.abstract";
import { Coach } from "./user.coach";

export class Athlete extends AUser {
    coach: Coach;
}