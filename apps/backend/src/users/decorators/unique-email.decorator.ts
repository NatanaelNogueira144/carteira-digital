import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
@ValidatorConstraint({ name: 'isUniqueEmail', async: true })
export class UniqueEmailValidator implements ValidatorConstraintInterface {
    constructor(private readonly prismaService: PrismaService) {}

    async validate(email: string): Promise<boolean> {
        const user = await this.prismaService.user.findUnique({
            where: { email },
        });

        return !user;
    }

    defaultMessage(args: ValidationArguments) {
        return `O e-mail "${args.value}" já está cadastrado`;
    }
}

export function IsUniqueEmail(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isUniqueEmail',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: UniqueEmailValidator,
        });
    };
}