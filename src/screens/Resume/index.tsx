import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';

import { HistoryCard } from '../../components/HistoryCard';

import { useState } from 'react';
import { Transaction } from '../../components/TransactionCard';
import { categories } from '../../utils/categories';

import { RFValue } from 'react-native-responsive-fontsize';
import theme from '../../global/styles/theme';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { ptBR } from 'date-fns/locale';

import { Container, Header, Title, Content, MonthSelect, MonthSelectButton, SelectIcon, Month, LoadingContainer } from './styles';
import { addMonths, format, subMonths } from 'date-fns';
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';

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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  function handleDateChange(action: 'next' | 'prev') {
    setLoading(true);

    if (action === 'next') {
      setSelectedDate(state => addMonths(state, 1));
    } else {
      setSelectedDate(state => subMonths(state, 1));
    }
  }

  async function loadTransactions() {    
    setLoading(true);

    const response = await AsyncStorage.getItem(`@gofinances:transactions_user:${user.id}`);
    const responseParse = response ? JSON.parse(response) : [];

    const expensives: DataListProps[] = responseParse.filter((item: DataListProps) => 
      item.type === 'down' 
      && new Date(item.date).getMonth() === selectedDate.getMonth() 
      && new Date(item.date).getFullYear() 
      && selectedDate.getFullYear()
    );

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
    setLoading(false);
  }

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, [selectedDate]));

  return (
    <Container>      
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      {loading ? (
        <LoadingContainer>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </LoadingContainer>
      ) : (
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight(),
          }}               
        >
          <MonthSelect>
            <MonthSelectButton onPress={() => handleDateChange('prev')}>
              <SelectIcon name="chevron-left" />
            </MonthSelectButton>

            <Month>{format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}</Month>

            <MonthSelectButton onPress={() => handleDateChange('next')}>
              <SelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>

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
      )}      
    </Container>
  )
}