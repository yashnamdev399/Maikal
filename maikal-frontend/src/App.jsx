import { Routes, Route } from 'react-router-dom';
import { LangProvider } from './context/LangContext';
import { AuthProvider } from './context/AuthContext';
import HomePage       from './pages/HomePage';
import ActivitiesPage from './pages/ActivitiesPage';
import PublicationsPage from './pages/PublicationsPage';
import AdminPage      from './pages/admin/AdminPage';

export default function App() {
  return (
    <AuthProvider>
      <LangProvider>
        <Routes>
          <Route path="/"             element={<HomePage />} />
          <Route path="/activities"   element={<ActivitiesPage />} />
          <Route path="/publications" element={<PublicationsPage />} />
          <Route path="/admin/*"      element={<AdminPage />} />
        </Routes>
      </LangProvider>
    </AuthProvider>
  );
}
