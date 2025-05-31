import { Module } from "@nestjs/common";
import { SupabaseService } from "./supabase.service";

/*
Encapsulates supabase client instantiation. Accessible through service layer.
*/
@Module({
    imports: [],
    controllers: [],
    providers: [SupabaseService],
    exports: [SupabaseService]
})

export class SupabaseModule{}
