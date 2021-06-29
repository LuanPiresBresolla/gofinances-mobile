import React from 'react';
import { getBottomSpace } from 'react-native-iphone-x-helper';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, Transaction } from '../../components/TransactionCard';

import { 
  Container, 
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
} from './styles';

export type DataListProps = Transaction & {
  id: string;
}

export function Dashboard() {
  const data: DataListProps[]  = [
    {
      id: '1',
      type: 'positive',
      title: 'Desenvolvimento de sites',
      amount: 'R$ 12.000,00',
      date: '13/04/2021',
      category: {
        name: 'Venda',
        icon: 'dollar-sign',
      },
    },
    {
      id: '2',
      type: 'negative',
      title: 'Hamburgueria Pizzy',
      amount: 'R$ 59,00',
      date: '13/02/2021',
      category: {
        name: 'Alimentacao',
        icon: 'coffee',
      }
    },
    {
      id: '3',
      type: 'negative',
      title: 'Aluguel apartamento',
      amount: 'R$ 1.200,00',
      date: '13/02/2021',
      category: {
        name: 'Casa',
        icon: 'shopping-bag',
      }
    }
  ];  

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo source={{ uri: 'https://github.com/luanpiresbresolla.png' }} />

            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Luan Bresolla</UserName>
            </User>
          </UserInfo>

          <Icon name="power" />
        </UserWrapper>
      </Header>

      <HighlightCards>
        <HighlightCard 
          title="Entradas" 
          amount="R$ 17.400,00" 
          lastTransaction="Ultima entrada dia 13 de abril"
          type="up"
        />

        <HighlightCard 
          title="Saídas" 
          amount="R$ 1.259,00" 
          lastTransaction="Ultima saída dia 13 de abril"
          type="down"
        />
        
        <HighlightCard 
          title="Total" 
          amount="R$ 16.141,00" 
          lastTransaction="01 à 16 de abril"
          type="total"
        />
      </HighlightCards>
    
      <Transactions>
        <Title>Listagem</Title>

        <TransactionsList
          data={data}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: getBottomSpace()}}
          renderItem={({ item }) => (
            <TransactionCard data={item} />
          )}
        />
      </Transactions>
    </Container>
  )
}