import React from 'react';
import { RectButtonProperties } from 'react-native-gesture-handler';
import { Container, Title } from './styles';

type ButtonProps = RectButtonProperties & {
  title: string;
  onPress: () => void;
}

export function Button ({ title, onPress, ...rest }: ButtonProps) {
  return (
    <Container onPress={onPress} {...rest}>
      <Title>{title}</Title>
    </Container>
  )
}