import GlobalStyles from './styles/GlobalStyles';
import Routes from './routes';
import useTheme from './hooks/useTheme';
import { ThemeProvider } from 'styled-components';
import { useEffect } from 'react';

export default function App() {
	const { theme } = useTheme();

	useEffect(() => {
		document.title = 'Carteira Digital';
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<GlobalStyles />
			<Routes />
		</ThemeProvider>
	);
}
