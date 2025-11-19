// src/pages/SendMoneyPage.jsx - Send money page

import { useNavigate } from 'react-router-dom';
import { SendMoneyForm } from '../components/SendMoneyForm';

export function SendMoneyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Back
          </button>
        </div>

        <SendMoneyForm />
      </div>
    </div>
  );
}

export default SendMoneyPage;
