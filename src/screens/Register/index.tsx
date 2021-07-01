import React from 'react';
import { useState } from 'react';
import { Button } from '../../components/Forms/Button';
import { CategorySelect } from '../../components/Forms/CategorySelect';

import { Input } from '../../components/Forms/Input';
import { TransactionTypeButton } from '../../components/TransactionTypeButton';

import { 
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes,
} from './styles';

export function Register () {
  const [transactionType, setTransactionType] = useState('');

  function handleTransactionsTypeSelect(type: 'up' | 'down') {
    setTransactionType(type);
  }

  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>

      <Form>
        <Fields>
          <Input placeholder="Nome"/>
          <Input placeholder="Preco"/>

          <TransactionsTypes>
            <TransactionTypeButton 
              type="up" 
              title="Income" 
              onPress={() => handleTransactionsTypeSelect('up')}
              isActive={transactionType === 'up'}
            />

            <TransactionTypeButton 
              type="down" 
              title="Outcome" 
              onPress={() => handleTransactionsTypeSelect('down')} 
              isActive={transactionType === 'down'}
            />
          </TransactionsTypes>

          <CategorySelect title="Categoria" />
        </Fields>
        

        <Button title="Enviar" />
      </Form>
    </Container>
  )
}