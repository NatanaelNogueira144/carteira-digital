import APIError from "../../core/exceptions/api-error.exception";
import Button from "../../components/Button";
import ButtonsGroup from "../../components/ButtonsGroup";
import IRequestErrors from "../../core/interfaces/request-errors.interface";
import ISaveExpenseRequest from "../../core/interfaces/requests/save-expense-request.interface";
import Input from '../../components/Input';
import InputFeedback from "../../components/InputFeedback";
import LoadingScreen from "../../components/LoadingScreen";
import Select from "../../components/Select";
import useAPI from "../../data/hooks/useAPI";
import { Container, Form, FormTitle } from "./styles";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function SaveExpensePage() {
    const { api } = useAPI();
    const { expenseId } = useParams();
    const navigate = useNavigate();
    
    const [isLoading, setIsLoading] = useState(false);
    const [request, setRequest] = useState({} as ISaveExpenseRequest);
    const [errors, setErrors] = useState({} as IRequestErrors);

    const loadExpense = useCallback(async (id: number): Promise<void> => {
        try {
            setIsLoading(true);
            const expense = await api.expenses.show(id);
            setRequest({
                description: expense.description,
                amount: expense.amount,
                frequency: expense.frequency,
                date: expense.date.split('T')[0]
            } as ISaveExpenseRequest);
        } catch(error: unknown) {
            if(error instanceof Error) alert(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [api.expenses]);

    useEffect(() => {
        if(expenseId) loadExpense(parseInt(expenseId));
    }, [expenseId, loadExpense]);

    return isLoading ? (
        <LoadingScreen />
    ) : (
        <Container>
            <Form>
                <FormTitle>{expenseId ? 'Editar' : 'Registrar'} Saída</FormTitle>
                <Input 
                    onChange={(e) => setRequest({...request, description: e.target.value})}
                    placeholder="Descrição"
                    required
                    type="text"
                    value={request.description ?? ''}
                />
                {errors.description && <InputFeedback message={errors.description} />}
                <Input 
                    onChange={(e) => setRequest({...request, amount: e.target.value ? parseFloat(e.target.value) : 0})}
                    placeholder="Quantia"
                    required
                    type="number"
                    step="0.01"
                    value={request.amount ? request.amount : ''}
                />
                {errors.amount && <InputFeedback message={errors.amount} />}
                <Select
                    onChange={(e) => setRequest({...request, frequency: e.target.value})}
                    required
                    value={request.frequency ?? ''}
                >
                    <option key={0} value="">Selecionar...</option>
                    <option key={1} value="eventual">Eventual</option>
                    <option key={2} value="recorrente">Recorrente</option>
                    <option key={3} value="emprestimo">Empréstimo</option>
                </Select>
                {errors.frequency && <InputFeedback message={errors.frequency} />}
                <Input 
                    onChange={(e) => setRequest({...request, date: e.target.value})}
                    placeholder="Data"
                    required
                    type="date"
                    value={request.date ?? ''}
                />
                {errors.date && <InputFeedback message={errors.date} />}
                <ButtonsGroup>
                    <Button type="button" onClick={async () => {
                        try {
                            if(expenseId) {
                                await api.expenses.update(parseInt(expenseId), request);
                                alert('A saída foi atualizada com sucesso!');
                            } else {
                                await api.expenses.store(request);
                                alert('A saída foi registrada com sucesso!');
                            }
                            navigate('/expenses');
                        } catch(error: unknown) {
                            if(error instanceof APIError) {
                                setErrors(error.getErrors() ?? {});
                            }
                        }
                    }}>
                        {expenseId ? 'Atualizar' : 'Registrar'}
                    </Button>
                    {expenseId && (
                        <Button type="button" onClick={async () => {
                            try {
                                await api.expenses.destroy(parseInt(expenseId));
                                alert('A saída foi excluída com sucesso!');
                                navigate('/expenses');
                            } catch(error: unknown) {
                                if(error instanceof APIError) alert(error);
                            }
                        }}>
                            Excluir
                        </Button>
                    )}
                </ButtonsGroup>
            </Form>
        </Container>
    );
}