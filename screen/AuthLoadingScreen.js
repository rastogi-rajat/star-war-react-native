import React, {Component} from 'react';
import {StyleSheet, StatusBar, View, ActivityIndicator, AsyncStorage} from 'react-native';


class AuthLoadingScreen extends Component {

    constructor() {
        super();
        this.checkLogin();
    }
    
    checkLogin = async () => {
        const userToken = await AsyncStorage.getItem('userData');
        this.props.navigation.navigate(userToken ? 'App' : 'Auth');
    };
    
    render() {
        return (
          <View style={styles.container}>
            <ActivityIndicator />
            <StatusBar barStyle="default" />
          </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default AuthLoadingScreen;