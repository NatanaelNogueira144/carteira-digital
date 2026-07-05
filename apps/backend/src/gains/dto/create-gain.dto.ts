import { IsDateString, IsIn, IsNotEmpty, IsNumber, IsString, Length, Min } from "class-validator";

export class CreateGainDto {
  @Min(1, { message: 'A quantidade deve ser maior ou igual à 1!' })
  @IsNotEmpty({ message: 'A quantidade é obrigatória!' })
  @IsNumber({}, { message: 'A quantidade deve ser um número!' })
  amount: number;

  @IsDateString({  }, { message: 'A data é inválida!' })
  @IsNotEmpty({ message: 'A data é obrigatória!' })
  date: string;

  @Length(1, 100, { message: 'A descrição precisa ter no máximo 100 caractéres!' })
  @IsNotEmpty({ message: 'A descrição é obrigatória!' })
  @IsString({ message: 'A descrição deve ser um texto!' })
  description: string;

  @IsNotEmpty({ message: 'A frequência é obrigatória!' })
  @IsIn(['recorrente', 'eventual', 'emprestimo'], { message: 'Esta frequência é inválida!' })
  frequency: 'recorrente' | 'eventual' | 'emprestimo';
}
