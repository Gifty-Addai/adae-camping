import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext<{
  signIn: boolean;
  setSignIn: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [signIn, setSignIn] = useState(false);
  
  return (
    <ModalContext.Provider value={{ signIn, setSignIn }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
