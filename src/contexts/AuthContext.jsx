import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Hydrate from localStorage on mount
  useEffect(() => {
    const initAuth = () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (savedToken && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setToken(savedToken);
          setUser(userData);
          setRole(userData.role);
          // Set axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        } catch (err) {
          console.error('Invalid stored auth data');
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token: newToken, user: newUser } = res.data;
      
      // Save to state and localStorage
      setToken(newToken);
      setUser(newUser);
      setRole(newUser.role);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      // Role-based redirect
      if (newUser.role === 'SuperAdmin' || newUser.role === 'Admin') {
        navigate('/dashboard');
      } else if (newUser.role === 'HR') {
        navigate('/hr/dashboard');
      } else {
        navigate('/dashboard');
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
  };

  const value = {
    user,
    token,
    role,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};




// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { ROLES } from '../../../backend/constants/roles.js';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [role, setRole] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Hydrate from localStorage on mount
//   useEffect(() => {
//     const savedToken = localStorage.getItem('token');
//     const savedUser = localStorage.getItem('user');

//     if (savedToken && savedUser) {
//       try {
//         const userData = JSON.parse(savedUser);

//         setToken(savedToken);
//         setUser(userData);
//         setRole(userData.role.toLowerCase()); // normalize role
//         axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
//       } catch (err) {
//         console.error('Invalid stored auth data', err);
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//       }
//     }

//     setLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
//       const { token: newToken, user: newUser } = res.data;

//       const normalizedRole = newUser.role.toLowerCase();

//       setToken(newToken);
//       setUser(newUser);
//       setRole(normalizedRole);

//       localStorage.setItem('token', newToken);
//       localStorage.setItem('user', JSON.stringify(newUser));
//       axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

//       const roleRedirect = {
//         [ROLES.SUPER_ADMIN]: '/dashboard',
//         [ROLES.ADMIN]: '/dashboard',
//         [ROLES.HR]: '/hr/dashboard',
//         [ROLES.EMPLOYEE]: '/employee/dashboard'
//       };
//       navigate(roleRedirect[normalizedRole] || '/dashboard');

//       return { success: true };
//     } catch (error) {
//       return { success: false, error: error.response?.data?.message || 'Login failed' };
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     setRole(null);
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     delete axios.defaults.headers.common['Authorization'];
//     navigate('/');
//   };

//   const value = {
//     user,
//     token,
//     role,
//     login,
//     logout,
//     loading,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

