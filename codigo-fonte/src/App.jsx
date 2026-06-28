import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Apiarios from './pages/Apiarios';
import Colmeias from './pages/Colmeias';
import Inspecoes from './pages/Inspecoes';
import Layout from './components/Layout';

function RotaPrivada({ children }) {
  const { autenticado } = useAuth();
  return autenticado ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <RotaPrivada>
                <Layout />
              </RotaPrivada>
            }
          >
            <Route index element={<Navigate to="/apiarios" replace />} />
            <Route path="apiarios" element={<Apiarios />} />
            <Route path="apiarios/:apiarioId/colmeias" element={<Colmeias />} />
            <Route path="colmeias/:colmeiaId/inspecoes" element={<Inspecoes />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
