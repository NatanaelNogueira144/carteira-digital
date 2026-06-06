export default interface IExpense {
    id: number;
    userId: number;
    amount: number;
    date: string;
    description: string;
    frequency: string;
    type: string;
    createdAt: string;
    updatedAt: string;
}