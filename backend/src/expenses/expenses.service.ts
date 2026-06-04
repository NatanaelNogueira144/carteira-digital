import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExpensesService {
  constructor(private prismaService: PrismaService) {}
  
  async create(createExpenseDto: CreateExpenseDto & { userId: number }): Promise<Expense> {
    return await this.prismaService.expense.create({
      data: {...createExpenseDto, date: new Date(createExpenseDto.date)}
    });
  }

  async findAll(userId: number): Promise<Expense[]> {
    return this.prismaService.expense.findMany({
      where: { userId }
    });
  }

  async findOne(id: number): Promise<Expense> {
    return this.prismaService.expense.findUnique({
      where: { id }
    });
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto): Promise<Expense> {
    return this.prismaService.expense.update({ 
      where: { id },
      data: {...updateExpenseDto, date: new Date(updateExpenseDto.date)}
    });
  }

  async remove(id: number): Promise<Expense> {
    return this.prismaService.expense.delete({ 
      where: { id }
    });
  }
}
