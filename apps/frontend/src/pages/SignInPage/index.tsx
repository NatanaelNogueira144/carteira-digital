import Button from '../../components/Button';
import Input from '../../components/Input';
import logoImg from '../../assets/logo.svg';
import useAuth from '../../hooks/useAuth';
import { Container, Logo, Form, FormTitle } from './styles';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignInPayload } from '../../services/authService';
import { normalizeApiError } from '../../core/http/api';

export default function SignInPage() {
  const { loading, signIn } = useAuth();
  const navigate = useNavigate();

  const [payload, setPayload] = useState({} as SignInPayload);

  async function handleSubmit() {
    try {
      await signIn(payload);
    } catch(e: unknown) {
      const err = normalizeApiError(e);
      alert(err.message);
    }
  }

  return (
    <Container>
      <Logo>
        <img src={logoImg} alt="Carteira Digital" />
        <h2>Carteira Digital</h2>
      </Logo>

      <Form>
        <FormTitle>Entrar</FormTitle>
        <Input 
          onChange={(e) => setPayload({...payload, email: e.target.value})}
          placeholder="E-mail"
          required
          type="email"
          value={payload.email ?? ''}
        />
        <Input 
          onChange={(e) => setPayload({...payload, password: e.target.value})}
          placeholder="Senha"
          required
          type="password"
          value={payload.password ?? ''}
        />
        <Button type="button" onClick={handleSubmit} disabled={loading.signIn}>
          Acessar
        </Button>
        <Button type="button" onClick={() => navigate('/sign-up')}>
          Não tem uma conta?
        </Button>
      </Form>
    </Container>
  );
}