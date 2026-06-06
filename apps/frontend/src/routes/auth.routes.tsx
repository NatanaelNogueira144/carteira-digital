import SignInPage from '../pages/SignInPage';
import { Routes, Route } from 'react-router-dom'; 
import SignUpPage from '../pages/SignUpPage';

export default function AuthRoutes() {
    return (
        <Routes>
            <Route path="/" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
        </Routes>
    );
}