import React, {Component} from 'react';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

import AuthLoadingScreen from './screen/AuthLoadingScreen';
import Login from './screen/Login';
import Home from './screen/Home';
import Details from './screen/Details';

const AppStack = createStackNavigator({
  Home,
  Details,
});
const AuthStack = createStackNavigator({ Login });

const AppNavigator =  createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);
export default class App extends Component {
  render() {
    return (
      <AppNavigator />
    );
  }
}
