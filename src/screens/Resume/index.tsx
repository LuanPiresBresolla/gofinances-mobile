import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';

import { HistoryCard } from '../../components/HistoryCard';

import { useState } from 'react';
import { Transaction } from '../../components/TransactionCard';
import { categories } from '../../utils/categories';

import { Container, Header, Title, Content } from './styles';
import { RFValue } from 'react-native-responsive-fontsize';
import theme from '../../global/styles/theme';

const storageKey = '@gofinances:transactions';

type DataListProps = Transaction & {
  id: string;
}

type TotalByCategory = {
  key: string;
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  percent: string;
};

export function Resume() {
  const [totalByCategories, setTotalByCategories] = useState<TotalByCategory[]>([]);

  async function loadTransactions() {
    const response = await AsyncStorage.getItem(storageKey);
    const responseParse = response ? JSON.parse(response) : [];

    const expensives: DataListProps[] = responseParse.filter((item: DataListProps) => item.type === 'down');

    const expensivesTotal = expensives.reduce((accumulator: number, expensive: DataListProps) => {
      return accumulator + Number(expensive.amount);
    }, 0);

    const totalByCategory: TotalByCategory[] = [];
    
    categories.forEach(category => {
      let categorySum = 0;

      expensives.forEach(expensive => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });

      const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`;

      if (categorySum > 0) {
        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          totalFormatted: categorySum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          total: categorySum,
          percent,
        })
      }
    });

    setTotalByCategories(totalByCategory);
  }

  useFocusEffect(() => {
    loadTransactions();
  });

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      <Content 
        contentContainerStyle={{ flex: 1, padding: 24, alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <VictoryPie 
          data={totalByCategories}
          x="percent"
          y="total"
          colorScale={totalByCategories.map(category => category.color)}
          labelRadius={50}
          style={{
            labels: { fontSize: RFValue(18), fontWeight: 'bold', fill: theme.colors.shape }
          }}
        />

        {totalByCategories?.map(category => (
          <HistoryCard
            key={category.key}
            title={category.name}
            amount={category.totalFormatted}
            color={category.color} 
          />
        ))}
      </Content>
    </Container>
  )
}