import Button from "../../components/Button";
import ButtonsGroup from "../../components/ButtonsGroup";
import Input from '../../components/Input';
import InputFeedback from "../../components/InputFeedback";
import Select from "../../components/Select";
import { normalizeApiError } from "../../core/http/api";
import { useExpense } from "../../hooks/useExpense";
import { ExpensePayload } from "../../services/expenseService";
import { Container, Form, FormTitle } from "./styles";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function SaveExpensePage() {
  const {
    createExpense,
    destroyExpense,
    error,
    loading,
    showExpense,
    updateExpense,
  } = useExpense();

  const { expenseId } = useParams();
  const navigate = useNavigate();

  const [payload, setPayload] = useState({} as ExpensePayload);

  const loadExpense = useCallback(async (id: number): Promise<void> => {
    try {
      const expense = await showExpense(id);
      setPayload({
        description: expense.description,
        amount: expense.amount,
        frequency: expense.frequency,
        date: expense.date.split('T')[0]
      });
    } catch(e: unknown) {
      const err = normalizeApiError(e);
      alert(err.message);
    }
  }, [showExpense]);

  useEffect(() => {
    if (expenseId) loadExpense(parseInt(expenseId));
  }, [expenseId, loadExpense]);

  async function handleSubmit() {
    try {
      if (expenseId) {
        await updateExpense(parseInt(expenseId), payload);
        alert('A saída foi atualizada com sucesso!');
      } else {
        await createExpense(payload);
        alert('A saída foi registrada com sucesso!');
      }
      navigate('/expenses');
    } catch (e: unknown) {
      const err = normalizeApiError(e);
      alert(err.message);
    }
  }

  async function handleDelete(id: number) {
    try {
      await destroyExpense(id);
      alert('A saída foi excluída com sucesso!');
      navigate('/expenses');
    } catch (e: unknown) {
      const err = normalizeApiError(e);
      alert(err.message);
    }
  }

  return (
    <Container>
      <Form>
        <FormTitle>{expenseId ? 'Editar' : 'Registrar'} Saída</FormTitle>
        <Input 
          onChange={(e) => setPayload({...payload, description: e.target.value})}
          placeholder="Descrição"
          required
          type="text"
          value={payload.description ?? ''}
        />
        {error?.errors?.description && <InputFeedback message={error?.errors?.description} />}
        <Input 
          onChange={(e) => setPayload({...payload, amount: e.target.value ? parseFloat(e.target.value) : 0})}
          placeholder="Quantia"
          required
          type="number"
          step="0.01"
          value={payload.amount ? payload.amount : ''}
        />
        {error?.errors?.amount && <InputFeedback message={error?.errors?.amount} />}
        <Select
          onChange={(e) => setPayload({...payload, frequency: e.target.value})}
          required
          value={payload.frequency ?? ''}
        >
          <option key={0} value="">Selecionar...</option>
          <option key={1} value="eventual">Eventual</option>
          <option key={2} value="recorrente">Recorrente</option>
          <option key={3} value="emprestimo">Empréstimo</option>
        </Select>
        {error?.errors?.frequency && <InputFeedback message={error?.errors?.frequency} />}
        <Input 
          onChange={(e) => setPayload({...payload, date: e.target.value})}
          placeholder="Data"
          required
          type="date"
          value={payload.date ?? ''}
        />
        {error?.errors?.date && <InputFeedback message={error?.errors?.date} />}
        <ButtonsGroup>
          <Button 
            type="button" 
            onClick={handleSubmit} 
            disabled={loading.create || loading.update}
          >
            {expenseId ? 'Atualizar' : 'Registrar'}
          </Button>
          {expenseId && (
            <Button 
              type="button" 
              onClick={async () => await handleDelete(parseInt(expenseId))} 
              disabled={loading.destroy}
            >
              Excluir
            </Button>
          )}
        </ButtonsGroup>
      </Form>
    </Container>
  );
}