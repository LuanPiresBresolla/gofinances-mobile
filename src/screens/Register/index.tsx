import React from 'react';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Keyboard, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Yup from 'yup';
import uuid from 'react-native-uuid';

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

const storageKey = '@gofinances:transactions';

const schema = Yup.object().shape({
  name: Yup.string().required('Informe o nome'),
  amount: Yup.number()
    .typeError('Informe um valor numérico')
    .positive('O valor não pode ser negativo').required('Informe o valor')
});

export function Register () {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const { navigate } = useNavigation();

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

  async function handleRegister({ name, amount }: FormData) {
    if (!transactionType) {
      return Alert.alert('Ops!', 'Selecione o tipo da transação!');
    }

    if (category.key === 'category') {
      return Alert.alert('Ops!', 'Selecione uma categoria!');
    }

    const newTransaction = {
      id: String(uuid.v4()),
      name, 
      amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    };

    try {
      const response = await AsyncStorage.getItem(storageKey);
      const responseParse = response ? JSON.parse(response) : [];

      await AsyncStorage.setItem(storageKey, JSON.stringify([...responseParse, newTransaction]));
      
      reset();
      setTransactionType('');
      setCategory({ key: 'category', name: 'Categoria' });

      navigate('Dashboard');
    } catch (error) {
      console.log(error);
      Alert.alert('Ops!', 'Não foi possível salvar!');
    }
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