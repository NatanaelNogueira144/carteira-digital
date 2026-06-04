import Toggle from '../Toggle';
import emojis from '../../core/utils/emojis';
import useTheme from '../../data/hooks/useTheme';
import { Container, Profile, Welcome, UserName } from './styles';
import { useMemo, useState } from 'react';
import useAuth from '../../data/hooks/useAuth';

export default function MainHeader() {
    const { user } = useAuth();
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
                <UserName>{user!.name}</UserName>
            </Profile>
        </Container>
    );
}