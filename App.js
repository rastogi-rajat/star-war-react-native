import React, {Component} from 'react';
import { createStackNavigator } from "react-navigation";

import Login from './screen/Login';
import Home from './screen/Home';

const AppNavigator = createStackNavigator({
  Login,
  Home: {
    screen: Home
  }
},{
  initialRouteName: 'Login',
});

export default class App extends Component {
  render() {
    return (
      <AppNavigator />
    );
  }
}
