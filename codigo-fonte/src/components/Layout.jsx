import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-amber-500 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/apiarios" className="flex items-center gap-2 text-white font-bold text-xl">
            <span className="text-2xl">🐝</span>
            <span>ApiHub</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/apiarios"
              className="text-white text-sm font-medium hover:text-amber-100 transition"
            >
              Apiários
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white text-amber-600 text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-amber-50 transition"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
