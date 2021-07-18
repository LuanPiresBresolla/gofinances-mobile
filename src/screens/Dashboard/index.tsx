import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, Transaction } from '../../components/TransactionCard';
import theme from '../../global/styles/theme';
import { useAuth } from '../../hooks/useAuth';

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
  LogoutButton,
  LoadingContainer,
} from './styles';

export type DataListProps = Transaction & {
  id: string;
}

type highlightDataProps = {
  amount: string;
  lastTransaction: string;
}

type highlightData = {
  entries: highlightDataProps;
  expensive: highlightDataProps;
  total: highlightDataProps;
};

export function Dashboard() {
  const [transaction, setTransaction] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<highlightData>({} as highlightData);
  const [loading, setLoading] = useState(true);
  const { signOut, user } = useAuth();

  function getLastTransactionInfo(collection: DataListProps[], type: 'up' | 'down') {
    const collectionFilttered = collection.filter((transaction) => transaction.type === type);

    if (collectionFilttered.length === 0) {
      return 0;  
    }
    
    const lastTransaction = new Date(
      Math.max.apply(Math, collectionFilttered        
        .map((transactionMap) => new Date(transactionMap.date).getTime())  
      )
    );

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`;
  }

  async function loadTransactions () {
    setLoading(true);
    const response = await AsyncStorage.getItem(`@gofinances:transactions_user:${user.id}`);
    const parse = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionFormatted: DataListProps[] = parse.map((item: DataListProps) => {
      if (item.type === 'up') {
        entriesTotal += Number(item.amount);
      } else {
        expensiveTotal += Number(item.amount);
      }

      const amount = Number(item.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const date = Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(item.date));
      
      return {
        id: item.id,
        name: item.name,
        type: item.type,
        category: item.category,
        amount,
        date,
      }
    });

    const total = entriesTotal - expensiveTotal;
    const lastTransactionEntries = getLastTransactionInfo(parse, 'up');
    const lastTransactionExpensives = getLastTransactionInfo(parse, 'down');
    const totalInterval = lastTransactionExpensives === 0 ? `Nao ha transacoes` : `01 a ${lastTransactionExpensives}`;
    

    setHighlightData({
      entries: { 
        amount: entriesTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        lastTransaction: lastTransactionEntries === 0 ? `Nao ha transacoes` : `Ultima entrada dia ${lastTransactionEntries}`
      },
      expensive: { 
        amount: expensiveTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        lastTransaction: lastTransactionExpensives === 0 ? `Nao ha transacoes` : `Ultima saída dia ${lastTransactionExpensives}`,
      },
      total: {
        amount: total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        lastTransaction: totalInterval,
      }
    });
    setTransaction(transactionFormatted);
    setLoading(false);
  };

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []));

  return (
    <Container>
      {loading ? (
        <LoadingContainer>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </LoadingContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: user.photo }} />

                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCards>
            <HighlightCard 
              title="Entradas" 
              amount={highlightData?.entries.amount}
              lastTransaction={highlightData?.entries.lastTransaction}
              type="up"
            />

            <HighlightCard 
              title="Saídas" 
              amount={highlightData?.expensive.amount}
              lastTransaction={highlightData?.expensive.lastTransaction}
              type="down"
            />
            
            <HighlightCard 
              title="Total" 
              amount={highlightData?.total.amount}
              lastTransaction={highlightData?.total.lastTransaction}
              type="total"
            />
          </HighlightCards>
          
          <Transactions>
            <Title>Listagem</Title>

            <TransactionsList
              data={transaction}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingBottom: getBottomSpace()}}
              renderItem={({ item }) => (
                <TransactionCard data={item} />
              )}
            />
          </Transactions>
        </>
      )}
    </Container>
  )
}
