import DashboardPage from '../pages/DashboardPage';
import ExpensesListPage from '../pages/ExpensesListPage';
import GainsListPage from '../pages/GainsListPage';
import Layout from '../components/Layout';
import SaveExpensePage from '../pages/SaveExpensePage';
import SaveGainPage from '../pages/SaveGainPage';
import { Routes, Route } from 'react-router-dom';

export default function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/gains" element={<GainsListPage />} />
        <Route path="/gains/:gainId?" element={<SaveGainPage />} />
        <Route path="/gains/create" element={<SaveGainPage />} />
        <Route path="/expenses" element={<ExpensesListPage />} />
        <Route path="/expenses/:expenseId?" element={<SaveExpensePage />} />
        <Route path="/expenses/create" element={<SaveExpensePage />} />
      </Routes>
    </Layout>
  );
}