import { User } from "./user.interface";

export abstract class AUser implements User {
    id: number;
    name: string;
    email: string;
    username: string;
    password: string;
    role: 'athlete' | 'coach';
}