import Button from "../../components/Button";
import ButtonsGroup from "../../components/ButtonsGroup";
import Input from '../../components/Input';
import InputFeedback from "../../components/InputFeedback";
import Select from "../../components/Select";
import { normalizeApiError } from "../../core/http/api";
import { useGain } from "../../hooks/useGain";
import { GainPayload } from "../../services/gainService";
import { Container, Form, FormTitle } from "./styles";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function SaveGainPage() {
  const {
    createGain,
    destroyGain,
    error,
    loading,
    showGain,
    updateGain,
  } = useGain();

  const { gainId } = useParams();
  const navigate = useNavigate();
  
  const [payload, setPayload] = useState({} as GainPayload);

  const loadGain = useCallback(async (id: number): Promise<void> => {
    try {
      const gain = await showGain(id);
      setPayload({
        description: gain.description,
        amount: gain.amount,
        frequency: gain.frequency,
        date: gain.date.split('T')[0]
      });
    } catch(e: unknown) {
      const err = normalizeApiError(e);
      alert(err.message);
    }
  }, [showGain]);

  useEffect(() => {
    if (gainId) loadGain(parseInt(gainId));
  }, [gainId, loadGain]);

  async function handleSubmit() {
    try {
      if (gainId) {
        await updateGain(parseInt(gainId), payload);
        alert('A entrada foi atualizada com sucesso!');
      } else {
        await createGain(payload);
        alert('A entrada foi registrada com sucesso!');
      }
      navigate('/gains');
    } catch(e: unknown) {
      const err = normalizeApiError(e);
      alert(err.message);
    }
  }

  async function handleDelete(id: number) {
    try {
      await destroyGain(id);
      alert('A entrada foi excluída com sucesso!');
      navigate('/gains');
    } catch(e: unknown) {
      const err = normalizeApiError(e);
      alert(err.message);
    }
  }

  return (
    <Container>
      <Form>
        <FormTitle>{gainId ? 'Editar' : 'Registrar'} Entrada</FormTitle>
        <Input 
          onChange={(e) => setPayload({...payload, description: e.target.value})}
          placeholder="Descrição"
          required
          type="text"
          value={payload.description ?? ''}
        />
        {error?.errors?.description && <InputFeedback message={error.errors.description} />}
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
            {gainId ? 'Atualizar' : 'Registrar'}
          </Button>
          {gainId && (
            <Button 
              type="button" 
              onClick={async () => handleDelete(parseInt(gainId))} 
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