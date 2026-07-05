import Toggle from '../Toggle';
import emojis from '../../utils/emojis';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import { Container, Profile, Welcome, UserName } from './styles';
import { useMemo, useState } from 'react';

export default function MainHeader() {
  const { signedUser } = useAuth();
  const { toggleTheme, theme } = useTheme();
  const [darkTheme, setDarkTheme] = useState(() => theme.title === 'dark' ? true : false);

  const handleChangeTheme = () => {
    setDarkTheme(!darkTheme);
    toggleTheme();
  }

  const emoji = useMemo(() => {
    const indice = Math.floor(Math.random() * emojis.length);
    return emojis[indice];
  }, []);

  return (
    <Container>
      <Toggle
        labelLeft="Claro"
        labelRight="Escuro"
        checked={darkTheme}
        onChange={handleChangeTheme}
      />

      <Profile>
        <Welcome>Olá, {emoji}</Welcome>
        <UserName>{signedUser!.name}</UserName>
      </Profile>
    </Container>
  );
}