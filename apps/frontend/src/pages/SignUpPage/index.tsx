import Button from '../../components/Button';
import Input from '../../components/Input';
import InputFeedback from '../../components/InputFeedback';
import logoImg from '../../assets/logo.svg';
import useAuth from '../../hooks/useAuth';
import { Container, Logo, Form, FormTitle } from './styles';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { SignUpPayload } from '../../services/authService';
import { normalizeApiError } from '../../core/http/api';

export default function SignUpPage() {
  const { error, loading, signUp } = useAuth();
  const navigate = useNavigate();

  const [payload, setPayload] = useState({} as SignUpPayload);

  async function handleSubmit() {
    try {
      await signUp(payload);
      alert('Você se cadastrou com sucesso!');
      navigate('/');
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
        <FormTitle>Cadastro</FormTitle>
        <Input 
          onChange={(e) => setPayload({...payload, name: e.target.value})}
          placeholder="Nome"
          required
          type="text"
          value={payload.name ?? ''}
        />
        {error?.errors?.name && <InputFeedback message={error.errors.name} />}
        <Input 
          onChange={(e) => setPayload({...payload, email: e.target.value})}
          placeholder="E-mail"
          required
          type="email"
          value={payload.email ?? ''}
        />
        {error?.errors?.email && <InputFeedback message={error.errors.email} />}
        <Input 
          onChange={(e) => setPayload({...payload, password: e.target.value})}
          placeholder="Senha"
          required
          type="password"
          value={payload.password ?? ''}
        />
        {error?.errors?.password && <InputFeedback message={error.errors.password} />}
        <Button type="button" onClick={handleSubmit} disabled={loading.signUp}>
          Cadastrar
        </Button>
        <Button type="button" onClick={() => navigate('/')}>
          Já tem uma conta?
        </Button>
      </Form>
    </Container>
  );
}