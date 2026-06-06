import Button from '../../components/Button';
import ISignInRequest from '../../core/interfaces/requests/sign-in-request.interface';
import Input from '../../components/Input';
import logoImg from '../../assets/logo.svg';
import useAuth from '../../data/hooks/useAuth';
import { Container, Logo, Form, FormTitle } from './styles';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignInPage() {
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const [request, setRequest] = useState({} as ISignInRequest);

    return (
        <Container>
            <Logo>
                <img src={logoImg} alt="Carteira Digital" />
                <h2>Carteira Digital</h2>
            </Logo>

            <Form>
                <FormTitle>Entrar</FormTitle>
                <Input 
                    onChange={(e) => setRequest({...request, email: e.target.value})}
                    placeholder="E-mail"
                    required
                    type="email"
                    value={request.email ?? ''}
                />
                <Input 
                    onChange={(e) => setRequest({...request, password: e.target.value})}
                    placeholder="Senha"
                    required
                    type="password"
                    value={request.password ?? ''}
                />
                <Button type="button" onClick={async () => {
                    try {
                        await signIn(request);
                    } catch(error: unknown) {
                        if(error instanceof Error) {
                            alert(error.message);
                        }
                    }
                }}>
                    Acessar
                </Button>
                <Button type="button" onClick={() => navigate('/sign-up')}>
                    Não tem uma conta?
                </Button>
            </Form>
        </Container>
    );
}