import { Container, Logo } from "./styles";
import logoImg from '../../assets/logo.svg';

export default function LoadingScreen() {
  return (
    <Container>
      <Logo>
        <img src={logoImg} alt="Carteira Digital" />
        <h2>Carteira Digital</h2>
      </Logo>
    </Container>
  );
}