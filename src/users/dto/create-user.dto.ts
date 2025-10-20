import { IsString, IsEmail, MinLength, MaxLength, } from "class-validator"

export class CreateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @MaxLength(32)
    @MinLength(6)
    password: string;
}