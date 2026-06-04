import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: ['content-type', 'authorization', 'accept'],
    origin: `http://localhost:${process.env.ORIGIN}`,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      whitelist: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const getPrettyClassValidatorErrors = (
          validationErrors: ValidationError[],
          parentProperty = '',
        ): {[key: string]: string} => {
          const errors: {[key: string]: string} = {};

          const getValidationErrorsRecursively = (
            validationErrors: ValidationError[],
            parentProperty = '',
          ) => {
            for (const error of validationErrors) {
              const propertyPath = parentProperty
                ? `${parentProperty}.${error.property}`
                : error.property;

              if(error.constraints) {
                errors[propertyPath] = Object.values(error.constraints)[0];
              }

              if (error.children?.length) {
                getValidationErrorsRecursively(error.children, propertyPath);
              }
            }
          };

          getValidationErrorsRecursively(validationErrors, parentProperty);

          return errors;
        };

        const errors = getPrettyClassValidatorErrors(validationErrors);

        return new BadRequestException({
          message: 'Erros de validação! Verifique os dados.',
          errors: errors
        });
      },
    }),
  );
  await app.listen(process.env.PORT);
}

bootstrap();
