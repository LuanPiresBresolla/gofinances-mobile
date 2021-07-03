import React from 'react';
import { TextInputProps } from 'react-native';
import { Control, Controller } from 'react-hook-form';

import { Input } from '../Input';

import { Container, Error } from "./styles";

type InputProps = TextInputProps & {
  control: Control;
  name: string;
  error: string;
};

export function InputForm({ name, control, error, ...rest }: InputProps) {
  return (
    <Container>
      {error && <Error>* {error}</Error> }

      <Controller 
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Input 
            onChangeText={onChange} 
            value={value}
            {...rest}
          />
        )}
      />
    </Container>
  )
}