import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { IsUniqueEmail } from '../decorators/unique-email.decorator';

export class CreateUserDto {
    @Length(1, 100, { message: 'O nome precisa ter no máximo 100 caractéres!' })
    @IsNotEmpty({ message: 'O nome é obrigatório!' })
    @IsString({ message: 'O nome deve ser um texto!' })
    name: string;

    @IsNotEmpty({ message: 'O email é obrigatório!' })
    @IsEmail({}, { message: 'O email é inválido!' })
    @IsString({ message: 'O email deve ser um texto!' })
    @IsUniqueEmail({ message: 'Este e-mail já está em uso.' })
    email: string;

    @IsNotEmpty({ message: 'A senha é obrigatória!' })
    @IsString({ message: 'A senha deve ser um texto!' })
    password: string;
}