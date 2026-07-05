import App from './app.routes';
import Auth from './auth.routes';
import LoadingScreen from '../components/LoadingScreen';
import useAuth from '../hooks/useAuth';
import { BrowserRouter } from 'react-router-dom';

export default function Routes() {
  const { loading, isSigned } = useAuth();

  const isLoading = loading.signIn || loading.signOut;

  return isLoading ? <LoadingScreen /> : (
    <BrowserRouter>
      {isSigned ? <App /> : <Auth />}
    </BrowserRouter>
  );
}