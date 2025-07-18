import Dashboard from '../pages/Dashboard';
import Layout from '../components/Layout';
import List from '../pages/List';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

const AppRoutes: React.FC = () => (
    <Layout>
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/list/:type" element={<List />} />
        </Routes>
    </Layout>
);

export default AppRoutes;