import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsNotEmpty({ message: 'O email é obrigatório!' })
    @IsEmail({}, { message: 'O email é inválido!' })
    email: string;

    @IsNotEmpty({ message: 'A senha é obrigatória!' })
    password: string;
}