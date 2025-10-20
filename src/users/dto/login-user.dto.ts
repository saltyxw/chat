import { PickType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginUserDto extends PickType(CreateUserDto, ['email', 'password'] as const) {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}