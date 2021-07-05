import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import { Dashboard } from '../screens/Dashboard';
import { Register } from '../screens/Register';

import theme from '../global/styles/theme';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  return (
    <Navigator
      tabBarOptions={{
        activeTintColor: theme.colors.secondary,
        inactiveTintColor: theme.colors.text,
        labelPosition: 'beside-icon',
        style: { 
          paddingVertical: Platform.OS === 'ios' ? 20 : 0,
          height: 68,
        }
      }}
    >
      <Screen 
        name="Dashboard"
        component={Dashboard}
        options={{ 
          title: 'Listagem',
          tabBarIcon: ({ size, color }) => <MaterialIcons name="format-list-bulleted" size={size} color={color} />
        }}
      />

      <Screen 
        name="Register" 
        component={Register}
        options={{ 
          title: 'Cadastrar',
          tabBarIcon: ({ size, color }) => <MaterialIcons name="attach-money" size={size} color={color} />
        }}
      />

      <Screen 
        name="Resumo" 
        component={Register}
        options={{ 
          title: 'Resumo',
          tabBarIcon: ({ size, color }) => <MaterialIcons name="pie-chart" size={size} color={color} />
        }}
      />
    </Navigator>
  )
}