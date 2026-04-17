import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { BASE_URL } from '../config/api';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Prevent double-connect in React StrictMode
    if (socketRef.current) return;

    const instance = io(BASE_URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'], // fallback to polling if WS fails
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 10000,
    });

    socketRef.current = instance;

    instance.on('connect', () => {
      console.log('✅ Socket connected:', instance.id);
      setSocket(instance);
    });

    instance.on('connect_error', (err) => {
      // Silent — backend socket may not be running or employee role doesn't need it
      if (import.meta.env.DEV) {
        console.warn('⚠️ Socket connection failed (non-critical):', err.message);
      }
      // Stop retrying after first failure to avoid console spam
      instance.io.opts.reconnectionAttempts = 0;
    });

    instance.on('disconnect', (reason) => {
      if (import.meta.env.DEV) {
        console.log('🔌 Socket disconnected:', reason);
      }
    });

    instance.on('employeeUpdate', (data) => {
      window.dispatchEvent(new CustomEvent('employeeUpdate', { detail: data }));
    });

    instance.on('employeeDelete', (data) => {
      window.dispatchEvent(new CustomEvent('employeeDelete', { detail: data }));
    });

    return () => {
      // Only disconnect on true unmount, not StrictMode remount
      instance.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, []); // empty deps — connect once on mount

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
