import React, { useState } from 'react';
import Toggle from '../Toggle';
import logoImg from '../../assets/logo.svg';
import { IconDashboard, IconArrowDown, IconArrowUp, IconDoorExit, IconX, IconMenu } from '@tabler/icons-react';
import { useAuth } from '../../hooks/auth';
import { useTheme } from '../../hooks/theme';
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

const Aside: React.FC = () => {
    const { signOut } = useAuth();
    const { toggleTheme, theme } = useTheme();

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

                <MenuItemLink href="/list/entry-balance">
                    <IconArrowUp />
                    Entradas
                </MenuItemLink>

                <MenuItemLink href="/list/exit-balance">
                    <IconArrowDown />
                    Saídas
                </MenuItemLink>

                <MenuItemButton onClick={signOut}>
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
}

export default Aside;