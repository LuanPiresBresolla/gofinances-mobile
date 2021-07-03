import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import { 
  Container,
  Category,
  Icon,
} from './styles';

type CategorySelectProps = TouchableOpacityProps & {
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