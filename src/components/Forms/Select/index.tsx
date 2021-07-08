import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';

import { 
  Container,
  Category,
  Icon,
} from './styles';

type CategorySelectProps = RectButtonProps & {
  title: string;
};

export function Select({ title, ...rest }: CategorySelectProps) {
  return (
    <Container {...rest} activeOpacity={0.7}>
      <Category>{title}</Category>
      <Icon name="chevron-down"/>
    </Container>
  )
}