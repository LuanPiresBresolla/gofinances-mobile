import styled, { css } from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

type ButtonProps =  {
  type: 'up' | 'down';
  isActive: boolean;
};  

export const Container = styled(TouchableOpacity)<ButtonProps>`
  width: 48%;
  padding: 16px 35px;

  flex-direction: row;
  align-items: center;
  justify-content: center;

  ${({ isActive, type }) => isActive && type === 'down' && css`
    background: ${({ theme }) => theme.colors.attention_light};
  `}

  ${({ isActive, type }) => isActive && type === 'up' && css`
    background: ${({ theme }) => theme.colors.success_light};
  `}

  border: ${({ isActive }) => isActive ? 0 : 1.5}px solid ${({ theme, isActive }) => theme.colors.text};
  border-radius: 5px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.text_dark};
  font-size: ${RFValue(14)}px;
`;

export const Icon = styled(Feather)<ButtonProps>`
  font-size: ${RFValue(24)}px;
  margin-right: 12px;
  color: ${({ type, theme }) => 
    type === 'up' ? theme.colors.success : theme.colors.attention
  }
`;