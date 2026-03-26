import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within SocketProvider');
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io('http://localhost:5000', {
      autoConnect: true,
      transports: ['websocket']
    });

    socketInstance.on('connect', () => {
      console.log('✅ Socket connected:', socketInstance.id);
    });

    socketInstance.on('employeeUpdate', (data) => {
      console.log('🔄 Employee updated:', data);
      // Trigger refetch in parent components
      window.dispatchEvent(new CustomEvent('employeeUpdate', { detail: data }));
    });

    socketInstance.on('employeeDelete', (data) => {
      console.log('🗑️ Employee deleted:', data);
      window.dispatchEvent(new CustomEvent('employeeDelete', { detail: data }));
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

