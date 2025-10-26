import { UserType } from "./user";

export type RegisterUserType = Pick<UserType, 'email' | 'name' | 'password'>
export type LoginUserType = Omit<UserType, 'name' | 'avatarLink'>