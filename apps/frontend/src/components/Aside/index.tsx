import Toggle from '../Toggle';
import logoImg from '../../assets/logo.svg';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import {
  Container,
  Header,
  LogImg,
  Title,
  MenuContainer,
  MenuItemLink,
  MenuItemButton,
  ToggleMenu, 
  ThemeToggleFooter,
}  from './styles';
import {
  IconDashboard,
  IconArrowDown,
  IconArrowUp,
  IconDoorExit,
  IconX,
  IconMenu,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Aside() {
  const { signOut } = useAuth();
  const { toggleTheme, theme } = useTheme();
  const navigate = useNavigate();

  const [toggleMenuIsOpened, setToggleMenuIsOpened] = useState(false);
  const [darkTheme, setDarkTheme] = useState(() => theme.title === 'dark' ? true : false);

  const handleToggleMenu = () => setToggleMenuIsOpened(!toggleMenuIsOpened);

  const handleChangeTheme = () => {
    setDarkTheme(!darkTheme);
    toggleTheme();
  }

  return (
    <Container $menuIsOpen={toggleMenuIsOpened}>
      <Header>
        <ToggleMenu onClick={handleToggleMenu}>
          {toggleMenuIsOpened ? <IconX /> : <IconMenu />}
        </ToggleMenu>

        <LogImg src={logoImg} alt="Logo Carteira Digital" />
        <Title>Carteira Digital</Title>
      </Header>

      <MenuContainer>
        <MenuItemLink href="/">
          <IconDashboard />
          Painel Principal
        </MenuItemLink>

        <MenuItemLink href="/gains">
          <IconArrowUp />
          Entradas
        </MenuItemLink>

        <MenuItemLink href="/expenses">
          <IconArrowDown />
          Saídas
        </MenuItemLink>

        <MenuItemButton onClick={() => {
          signOut();
          navigate('/');
        }}>
          <IconDoorExit />
          Sair
        </MenuItemButton>
      </MenuContainer>

      <ThemeToggleFooter $menuIsOpen={toggleMenuIsOpened}>
        <Toggle
          labelLeft="Claro"
          labelRight="Escuro"
          checked={darkTheme}
          onChange={handleChangeTheme}
        />
      </ThemeToggleFooter>
    </Container>
  );
};