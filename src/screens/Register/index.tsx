import React from 'react';
import { useState } from 'react';
import { Keyboard, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Button } from '../../components/Forms/Button';
import { Select } from '../../components/Forms/Select';
import { InputForm } from '../../components/Forms/InputForm';
import { TransactionTypeButton } from '../../components/TransactionTypeButton';

import { CategorySelect } from '../CategorySelect';

import { 
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes,
} from './styles';

type FormData = {
  name: string;
  amount: string;
};

const schema = Yup.object().shape({
  name: Yup.string().required('Informe o nome'),
  amount: Yup.number()
    .typeError('Informe um valor numérico')
    .positive('O valor não pode ser negativo').required('Informe o valor')
});

export function Register () {
  const { control, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  function handleTransactionsTypeSelect(type: 'up' | 'down') {
    setTransactionType(type);
  }

  function handleCloseModalCategory() {
    setCategoryModalOpen(false);
  }

  function handleOpenModalCategory() {
    setCategoryModalOpen(true);
  }

  function handleRegister({ name, amount }: FormData) {
    if (!transactionType) {
      return Alert.alert('Ops!', 'Selecione o tipo da transação!');
    }

    if (category.key === 'category') {
      return Alert.alert('Ops!', 'Selecione uma categoria!');
    }

    const data = {
      name, 
      amount,
      transactionType,
      category: category.key,
    };

    console.log(data);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm 
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            
            <InputForm
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />

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

            <Select title={category.name} onPress={handleOpenModalCategory} />

            <Modal visible={categoryModalOpen}>
              <CategorySelect              
                category={category}
                setCategory={setCategory}
                closeSelectCategory={handleCloseModalCategory}
              />
            </Modal>
          </Fields>
          

          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>
      </Container>
    </TouchableWithoutFeedback>
  )
}