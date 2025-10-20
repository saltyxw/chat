import { PickType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsEmail, IsEmpty } from "class-validator";

export class LoginUserDto extends PickType(CreateUserDto, ['email', 'password'] as const) {
    @IsEmail()
    @IsEmpty()
    email: string;

    @IsEmpty()
    password: string;
}