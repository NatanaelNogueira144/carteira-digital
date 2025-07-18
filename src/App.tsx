import './App.css';
import GlobalStyles from './styles/GlobalStyles';
import Routes from './routes';
import { ThemeProvider } from 'styled-components';
import { useTheme } from './hooks/theme';

export default function App() {
	const { theme } = useTheme();

	return (
		<ThemeProvider theme={theme}>
			<GlobalStyles />
			<Routes />
		</ThemeProvider>
	);
}
