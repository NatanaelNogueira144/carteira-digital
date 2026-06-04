import App from './app.routes';
import Auth from './auth.routes';
import LoadingScreen from '../components/LoadingScreen';
import useAuth from '../data/hooks/useAuth';
import { BrowserRouter } from 'react-router-dom';

export default function Routes() {
    const { isLoading, user } = useAuth();

    return isLoading ? <LoadingScreen /> : (
        <BrowserRouter>
            {user != null ? <App /> : <Auth />}
        </BrowserRouter>
    );
}