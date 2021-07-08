import React from 'react';
import { categories } from '../../utils/categories';

import { 
  Container,
  Title,
  Amount,
  Footer,
  Category,
  Icon,
  CategoryName,
  Date,
} from './styles';

export type Transaction = {
  type: 'up' | 'down';
  name: string;
  amount: string;
  category: string;
  date: string;
};

type TransactionCardProps = {
  data: Transaction;
};

export function TransactionCard({ data }: TransactionCardProps) {
  const category = categories.find(item => item.key === data.category);

  return (
    <Container>
      <Title>{data.name}</Title>

      <Amount type={data.type}>
        {data.type === 'down' && '- '}
        {data.amount}
      </Amount>

      <Footer>
        <Category>
          <Icon name={category?.icon} />
          <CategoryName>{category?.name}</CategoryName>
        </Category>

        <Date>{data.date}</Date>
      </Footer>
    </Container>
  )
}