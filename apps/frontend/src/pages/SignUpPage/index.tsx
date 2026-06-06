import APIError from '../../core/exceptions/api-error.exception';
import Button from '../../components/Button';
import IRequestErrors from '../../core/interfaces/request-errors.interface';
import ISignUpRequest from '../../core/interfaces/requests/sign-up-request.interface';
import Input from '../../components/Input';
import InputFeedback from '../../components/InputFeedback';
import logoImg from '../../assets/logo.svg';
import useAuth from '../../data/hooks/useAuth';
import { Container, Logo, Form, FormTitle } from './styles';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SignUpPage() {
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const [request, setRequest] = useState({} as ISignUpRequest);
    const [errors, setErrors] = useState({} as IRequestErrors);

    return (
        <Container>
            <Logo>
                <img src={logoImg} alt="Carteira Digital" />
                <h2>Carteira Digital</h2>
            </Logo>

            <Form>
                <FormTitle>Cadastro</FormTitle>
                <Input 
                    onChange={(e) => setRequest({...request, name: e.target.value})}
                    placeholder="Nome"
                    required
                    type="text"
                    value={request.name ?? ''}
                />
                {errors.name && <InputFeedback message={errors.name} />}
                <Input 
                    onChange={(e) => setRequest({...request, email: e.target.value})}
                    placeholder="E-mail"
                    required
                    type="email"
                    value={request.email ?? ''}
                />
                {errors.email && <InputFeedback message={errors.email} />}
                <Input 
                    onChange={(e) => setRequest({...request, password: e.target.value})}
                    placeholder="Senha"
                    required
                    type="password"
                    value={request.password ?? ''}
                />
                {errors.password && <InputFeedback message={errors.password} />}
               <Button type="button" onClick={async () => {
                    try {
                        await signUp(request);
                        alert('Você se cadastrou com sucesso!');
                        navigate('/');
                    } catch(error: unknown) {
                        if(error instanceof Error) {
                            alert(error.message);
                        }
                        
                        if(error instanceof APIError) {
                            setErrors(error.getErrors() ?? {});
                        }
                    }
                }}>
                    Cadastrar
                </Button>
                <Button type="button" onClick={() => navigate('/')}>
                    Já tem uma conta?
                </Button>
            </Form>
        </Container>
    );
}