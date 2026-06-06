import React, { createContext, useState } from 'react';
import dark from '../../styles/themes/dark';
import light from '../../styles/themes/light';
import useLocalStorage from '../hooks/useLocalStorage';

export interface ThemeContextProps {
    toggleTheme(): void;
    theme: ITheme;
}

interface ITheme {
    title: string;
    colors: {
        primary: string;
        secondary: string;
        tertiary: string;
        white: string;
        black: string;
        gray: string;
        success: string;
        info: string;
        warning: string;
    }
}

export const ThemeContext = createContext<ThemeContextProps>({} as ThemeContextProps);

export function ThemeProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const { get, set } = useLocalStorage();
    
    const [theme, setTheme] = useState<ITheme>(() => {
        const themeSaved = get('@carteira-digital:theme') as ITheme|null;
        return themeSaved ? themeSaved : dark;
    });

    const toggleTheme = () => {
        if(theme.title === 'dark') {
            setTheme(light);
            set('@carteira-digital:theme', light);
        } else {
            setTheme(dark);
            set('@carteira-digital:theme', dark);
        }
    };

    return (
        <ThemeContext.Provider value={{ toggleTheme, theme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeContext;