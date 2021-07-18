import React from 'react';
import { useState } from 'react';
import { ActivityIndicator, Platform } from 'react-native';
import { Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';
import { SignInSocialButton } from '../../components/SignInSocialButton';
import theme from '../../global/styles/theme';
import { useAuth } from '../../hooks/useAuth';

import { Container, Header, TitleWrapper, Title, SignInTitle, Footer, FooterWrapper } from './styles';

export function SignIn () {
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle, signInWithApple } = useAuth();

  async function handleSignInWithGoogle() {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error) {
      setLoading(false);
      console.log(error);
      Alert.alert('Não foi possível realizar login com a conta google');
    }
  }

  async function handleSignInWithApple() {
    try {
      setLoading(true);
      await signInWithApple();
    } catch (error) {
      setLoading(false);
      console.log(error);
      Alert.alert('Não foi possível realizar login com a conta apple');
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg 
            width={RFValue(120)} 
            height={RFValue(68)}
          />

          <Title>Controle suas{'\n'}finanças de forma{'\n'}muito simples</Title>
        </TitleWrapper>        

        <SignInTitle>Faça seu login com{'\n'}uma das contas abaixo</SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton 
            title="Entrar com Google"
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
            enabled={!loading}
          />
          
          {Platform.OS === 'ios' && (
            <SignInSocialButton 
              title="Entrar com Apple" 
              svg={AppleSvg} 
              onPress={handleSignInWithApple}
              enabled={!loading}
            />
          )}
        </FooterWrapper>

        {loading && (
          <ActivityIndicator
            style={{ marginTop: 18 }}
            color={theme.colors.shape}
            size="small"
          />
        )}
      </Footer>
    </Container>
  )
}