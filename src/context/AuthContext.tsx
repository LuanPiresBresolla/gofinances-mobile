import React, { ReactNode } from 'react';
import { createContext } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  photo?: string;
};

type AuthorizationResponse = {
  params: {
    access_token: string;
  };
  type: string;
}

type AuthContextData = {
  user: User;
  loading: boolean;
  signInWithGoogle(): Promise<void>;
  signInWithApple(): Promise<void>;
  signOut(): Promise<void>;
};

export const AuthContext = createContext({} as AuthContextData);

type AuthProviderProps = {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserStorage() {
      const data = await AsyncStorage.getItem('@gofinances:user');

      if (data) {
        const user = JSON.parse(data) as User;
        setUser(user);
      }

      setLoading(false);
    }

    loadUserStorage();
  }, []);

  async function signInWithGoogle () {
    try {
      const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
      const REDIRECT_URI = process.env.EXPO_REDIRECT_URI;
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
      
      const { params, type } = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse;

      if (type === 'success') {
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
        const userInfo = await response.json();

        const user = {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.given_name,
          photo: userInfo.picture,
        }

        setUser(user);
        await AsyncStorage.setItem('@gofinances:user', JSON.stringify(user));
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function signInWithApple () {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ]
      });

      if (credential) {
        const name = credential.fullName?.givenName!;
        const photo = `https://ui-avatars.com/api/?name=${name}&length=1`;

        const user = {
          id: String(credential.user),
          email: credential.email!,
          name,
          photo,
        }

        setUser(user);
        await AsyncStorage.setItem('@gofinances:user', JSON.stringify(user));
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function signOut() {
    setUser({} as User);
    await AsyncStorage.removeItem('@gofinances:user');
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithApple, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}