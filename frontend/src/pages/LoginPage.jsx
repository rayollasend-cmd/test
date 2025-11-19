// src/pages/LoginPage.jsx - Login page

import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">CaribRemit</h1>
          <p className="text-blue-100">Send Money to the Caribbean</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <LoginForm onSuccess={handleLoginSuccess} />
        </div>

        {/* Footer Link */}
        <div className="text-center mt-8">
          <p className="text-white text-sm">
            Problems signing in?{' '}
            <a href="/support" className="underline hover:opacity-80">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
