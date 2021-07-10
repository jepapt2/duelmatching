import React, { VFC, createContext, useEffect, useState } from 'react';
import { Spinner } from '@chakra-ui/react';
import { auth } from '../../firebase';

type AuthContextProps = {
  currentUser: string | null | undefined;
  loading: boolean;
};

type Props = {
  children: React.ReactNode;
};

export const AuthContext: React.Context<AuthContextProps> =
  createContext<AuthContextProps>({
    currentUser: undefined,
    loading: true,
  });

export const AuthProvider: VFC<Props> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<string | null | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user?.uid);
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {loading ? <Spinner /> : <>{children}</>}
    </AuthContext.Provider>
  );
};
