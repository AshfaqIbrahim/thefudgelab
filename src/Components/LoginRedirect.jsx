// src/components/LoginRedirect.jsx
import { useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log('User after login:', user); 
      console.log('User role:', user.role); 
      
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F4E1]">
      <div className="text-center">
        <h2 className="text-xl font-bold text-[#543310]">Redirecting...</h2>
        <p className="text-[#74512D]">Please wait</p>
      </div>
    </div>
  );
};

export default LoginRedirect;