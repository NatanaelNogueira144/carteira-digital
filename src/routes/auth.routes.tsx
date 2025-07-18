import React from 'react';
import SignIn from '../pages/SignIn';
import { Routes, Route } from 'react-router-dom'; 

const AuthRoutes: React.FC = () => (
    <Routes>
        <Route path="/" element={<SignIn />} />
    </Routes>
);

export default AuthRoutes;