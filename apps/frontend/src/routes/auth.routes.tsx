import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import { Routes, Route } from 'react-router-dom'; 

export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
    </Routes>
  );
}