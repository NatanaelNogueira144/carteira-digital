import APIError from "../../core/exceptions/api-error.exception";
import Button from "../../components/Button";
import ButtonsGroup from "../../components/ButtonsGroup";
import IRequestErrors from "../../core/interfaces/request-errors.interface";
import ISaveGainRequest from "../../core/interfaces/requests/save-gain-request.interface";
import Input from '../../components/Input';
import InputFeedback from "../../components/InputFeedback";
import LoadingScreen from "../../components/LoadingScreen";
import Select from "../../components/Select";
import useAPI from "../../data/hooks/useAPI";
import { Container, Form, FormTitle } from "./styles";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function SaveGainPage() {
    const { api } = useAPI();
    const { gainId } = useParams();
    const navigate = useNavigate();
    
    const [isLoading, setIsLoading] = useState(false);
    const [request, setRequest] = useState({} as ISaveGainRequest);
    const [errors, setErrors] = useState({} as IRequestErrors);

    const loadGain = useCallback(async (id: number): Promise<void> => {
        try {
            setIsLoading(true);
            const gain = await api.gains.show(id);
            setRequest({
                description: gain.description,
                amount: gain.amount,
                frequency: gain.frequency,
                date: gain.date.split('T')[0]
            } as ISaveGainRequest);
        } catch(error: unknown) {
            if(error instanceof Error) alert(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [api.gains]);

    useEffect(() => {
        if(gainId) loadGain(parseInt(gainId));
    }, [gainId, loadGain]);

    return isLoading ? (
        <LoadingScreen />
    ) : (
        <Container>
            <Form>
                <FormTitle>{gainId ? 'Editar' : 'Registrar'}  Entrada</FormTitle>
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
                            if(gainId) {
                                await api.gains.update(parseInt(gainId), request);
                                alert('A entrada foi atualizada com sucesso!');
                            } else {
                                await api.gains.store(request);
                                alert('A entrada foi registrada com sucesso!');
                            }
                            navigate('/gains');
                        } catch(error: unknown) {
                            if(error instanceof APIError) {
                                setErrors(error.getErrors() ?? {});
                            }
                        }
                    }}>
                        {gainId ? 'Atualizar' : 'Registrar'}
                    </Button>
                    {gainId && (
                        <Button type="button" onClick={async () => {
                            try {
                                await api.gains.destroy(parseInt(gainId));
                                alert('A entrada foi excluída com sucesso!');
                                navigate('/gains');
                            } catch(error: unknown) {
                                if(error instanceof APIError) alert(error.message);
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