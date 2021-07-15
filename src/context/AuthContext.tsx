import React, { ReactNode } from 'react';
import { createContext } from 'react';
import * as AuthSession from 'expo-auth-session';

type User = {
  id: string;
  name: string;
  email: string;
  photo?: string;
};

type AuthContextData = {
  user: User;
  signInWithGoogle(): Promise<void>;
};

export const AuthContext = createContext({} as AuthContextData);

type AuthProviderProps = {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const user = { 
    id: '1', 
    email: 'a@a.com', 
    name: 'Luan'
  };

  async function signInWithGoogle () {
    try {
      const CLIENT_ID = '663799915856-djkgc8dakc1m4n393jfp7ct26c70714n.apps.googleusercontent.com';
      const REDIRECT_URI = 'https://auth.expo.io/@luanbresolla/gofinances';
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
      
      const response = await AuthSession.startAsync({ authUrl });

      console.log(response);

    } catch (error) {
      throw new Error(error);
    }
  }

  async function signInWithApple () {
    try {
      
    } catch (error) {
      throw new Error(error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}