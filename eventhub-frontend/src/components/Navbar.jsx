import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutGrid, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logoutContext } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutContext();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center text-xl font-bold text-gray-900 group">
            <div className="bg-blue-600 p-1.5 rounded-lg mr-2 group-hover:bg-blue-700 transition-colors">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            Event<span className="text-blue-600">Hub</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center text-sm font-medium text-gray-700">
                  <User className="w-4 h-4 mr-1.5 text-gray-400" />
                  Hi, {user.name}
                  {user.role === 'admin' && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded-md border border-indigo-200">
                      Admin
                    </span>
                  )}
                </div>
                {user.role === 'visitor' && (
                  <Link
                    to="/my-tickets"
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors ml-4"
                  >
                    Tiket Saya
                  </Link>
                )}

                {user.role === 'admin' && (
                  <>
                    <Link
                      to="/admin/validator"
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors ml-4 mr-2"
                    >
                      Validator
                    </Link>
                    <Link
                      to="/dashboard"
                      className="inline-flex items-center px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors ml-2"
                    >
                      Ke Dashboard
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-1.5 text-gray-500" />
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
