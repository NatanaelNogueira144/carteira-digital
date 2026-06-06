export class Expense {
    id: number;
    userId: number;
    amount: number;
    date: Date;
    description: string;
    frequency: 'recorrente' | 'eventual' | 'emprestimo';
    createdAt: Date;
    updatedAt: Date;
}
