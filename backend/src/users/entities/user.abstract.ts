import { Athlete } from "./user.athlete";
import { Coach } from "./user.coach";
import { User } from "./user.interface";

export abstract class AUser implements User {
    id: number;
    name: string;
    email: string;
    username: string;
    password: string;
    role: Athlete | Coach;
}